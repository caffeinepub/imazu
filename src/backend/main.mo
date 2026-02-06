import Map "mo:core/Map";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Migration "migration";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

(with migration = Migration.run)
actor {
  // Setup Authorization State
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Types & State
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product Types & State
  type ProductId = Nat;
  var nextProductId = 2; // Start from 2 since first product is preloaded

  type Product = {
    id : ProductId;
    name : Text;
    description : Text;
    price : Nat;
    images : [Text];
    active : Bool;
  };

  let products = Map.empty<ProductId, Product>();

  // Product Management - Public queries (no auth needed for viewing)
  public query func getAllProducts() : async [Product] {
    products.values().toArray();
  };

  public query func getActiveProducts() : async [Product] {
    products.values().toArray().filter(
      func(product) { product.active }
    );
  };

  public query func getProduct(id : ProductId) : async Product {
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) { product };
    };
  };

  // Product Management - Admin only
  public shared ({ caller }) func createProduct(
    name : Text,
    description : Text,
    price : Nat,
    images : [Text]
  ) : async Product {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can create products");
    };
    let product : Product = {
      id = nextProductId;
      name;
      description;
      price;
      images;
      active = true;
    };
    products.add(nextProductId, product);
    nextProductId += 1;
    product;
  };

  public shared ({ caller }) func updateProduct(
    id : ProductId,
    name : Text,
    description : Text,
    price : Nat,
    images : [Text],
    active : Bool
  ) : async Product {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update products");
    };
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?_) {
        let product : Product = {
          id;
          name;
          description;
          price;
          images;
          active;
        };
        products.add(id, product);
        product;
      };
    };
  };

  public shared ({ caller }) func deactivateProduct(id : ProductId) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can deactivate products");
    };
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found") };
      case (?product) {
        let updatedProduct = { product with active = false };
        products.add(id, updatedProduct);
      };
    };
  };

  // Order Types & State
  type OrderId = Nat;
  var nextOrderId = 2;

  public type CustomerInfo = {
    name : Text;
    phone : Text;
    address : Text;
  };

  public type LineItem = {
    productId : ProductId;
    quantity : Nat;
    price : Nat;
  };

  public type PaymentMethod = {
    #cashOnDelivery;
    #easyPaisa;
    #jazzCash;
  };

  public type OrderStatus = {
    #pending;
    #paymentVerified;
    #confirmed;
    #delivered;
    #cancelled;
  };

  public type Order = {
    id : OrderId;
    customer : CustomerInfo;
    lineItems : [LineItem];
    subtotal : Nat;
    deliveryFee : Nat;
    total : Nat;
    paymentMethod : PaymentMethod;
    transactionId : ?Text;
    createdAt : Time.Time;
    status : OrderStatus;
    createdBy : Principal;
  };

  let orders = Map.empty<OrderId, Order>();

  // Helper Functions
  module OrderModule {
    public func compareByCreatedAt(a : Order, b : Order) : Order.Order {
      if (a.createdAt < b.createdAt) {
        #less;
      } else if (a.createdAt > b.createdAt) {
        #greater;
      } else {
        #equal;
      };
    };
  };

  // Order Queries - Admin only
  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.toArray().sort(
      func((_, a), (_, b)) { OrderModule.compareByCreatedAt(a, b) }
    ).map(
      func((_, order)) { order }
    );
  };

  public query ({ caller }) func getOrder(id : OrderId) : async Order {
    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        // Allow access if caller is admin OR caller is the order creator (including guests)
        let isOrderCreator = (caller == order.createdBy);
        let isAdminUser = AccessControl.isAdmin(accessControlState, caller);

        if (not isAdminUser and not isOrderCreator) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        order;
      };
    };
  };

  // Create New Order - Anyone can create (including guests)
  public shared ({ caller }) func createOrder(
    customer : CustomerInfo,
    lineItems : [LineItem],
    subtotal : Nat,
    deliveryFee : Nat,
    paymentMethod : PaymentMethod,
    transactionId : ?Text, // Accept optional transaction ID
  ) : async Order {
    // No authorization check - guests can place orders
    let order : Order = {
      id = nextOrderId;
      customer;
      lineItems;
      subtotal;
      deliveryFee;
      total = subtotal + deliveryFee;
      paymentMethod;
      transactionId;
      createdAt = Time.now();
      status = #pending;
      createdBy = caller;
    };
    orders.add(nextOrderId, order);
    nextOrderId += 1;
    order;
  };

  // Update Order Payment Verification - Admin only
  public shared ({ caller }) func verifyPayment(id : OrderId, transactionId : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can verify payments");
    };
    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        if (order.status != #pending) {
          Runtime.trap("Can only verify payment for pending orders");
        };
        let updatedOrder = {
          order with
          status = #paymentVerified;
          transactionId = ?transactionId;
        };
        orders.add(id, updatedOrder);
      };
    };
  };

  // Confirm Order After Payment Verification - Admin only
  public shared ({ caller }) func confirmOrder(id : OrderId) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can confirm orders");
    };
    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        if (order.status != #paymentVerified) {
          Runtime.trap("Order must be payment verified before confirming");
        };
        let updatedOrder = { order with status = #confirmed };
        orders.add(id, updatedOrder);
      };
    };
  };

  // Mark Order as Delivered - Admin only
  public shared ({ caller }) func markOrderDelivered(id : OrderId) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can mark orders as delivered");
    };
    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        if (order.status != #confirmed) {
          Runtime.trap("Can only mark confirmed orders as delivered");
        };
        let updatedOrder = { order with status = #delivered };
        orders.add(id, updatedOrder);
      };
    };
  };

  // Cancel Order - Admin only
  public shared ({ caller }) func cancelOrder(id : OrderId) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can cancel orders");
    };
    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        if (order.status == #delivered) {
          Runtime.trap("Cannot cancel delivered orders");
        };
        let updatedOrder = { order with status = #cancelled };
        orders.add(id, updatedOrder);
      };
    };
  };
};
