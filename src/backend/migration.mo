import Map "mo:core/Map";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Principal "mo:core/Principal";

module {
  // Type aliases for readability
  type ProductId = Nat;
  type OrderId = Nat;

  // User Profile Types & State
  public type UserProfile = {
    name : Text;
  };

  // Product Types & State
  public type Product = {
    id : ProductId;
    name : Text;
    description : Text;
    price : Nat;
    images : [Text];
    active : Bool;
  };

  // Order Types & State
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
    createdAt : Int;
    status : OrderStatus;
    createdBy : Principal;
  };

  /// Old actor state (before migration)
  public type OldActorState = {
    userProfiles : Map.Map<Principal, UserProfile>;
    nextProductId : Nat;
    products : Map.Map<ProductId, Product>;
    nextOrderId : Nat;
    orders : Map.Map<OrderId, Order>;
  };

  /// New actor state (after migration, same as original in this case)
  public type NewActorState = {
    userProfiles : Map.Map<Principal, UserProfile>;
    nextProductId : Nat;
    products : Map.Map<ProductId, Product>;
    nextOrderId : Nat;
    orders : Map.Map<OrderId, Order>;
  };

  /// Migration function to update the product images for the specific product
  public func run(old : OldActorState) : NewActorState {
    let newProducts = old.products.map<ProductId, Product, Product>(
      func(_id, product) {
        // Check for the specific product name and update images if necessary
        if (product.name == "Brown leather Luxury Watch For Unisex Rs. 19") {
          {
            product with
            images = [
              "https://bafkreibd56dz5htgyecjhy3vvkxjrc6deo7iyrfnjukiihhg5gaw54vyuu.ipfs.dweb.link/",
              "https://bafkreiclovvvrsah5ouxyl3reejeecrl7z6nuffwjdrt4by3wiohweazru.ipfs.dweb.link/",
            ];
          };
        } else {
          product; // Preserve other products unchanged
        };
      }
    );

    {
      old with
      products = newProducts;
    };
  };
};
