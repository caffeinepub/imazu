import { useNavigate } from '@tanstack/react-router';
import { useGetAllOrders } from '../../hooks/useAdmin';
import { getPaymentMethodLabel } from '../../lib/payment';
import { getOrderStatusLabel, getOrderStatusBadgeVariant } from '../../lib/orderStatus';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Loader2 } from 'lucide-react';

export default function AdminOrdersPage() {
  const navigate = useNavigate();
  const { data: orders, isLoading } = useGetAllOrders();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders</p>
      </div>

      {!orders || orders.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">No orders yet</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id.toString()}>
                    <TableCell className="font-medium">#{order.id.toString()}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.customer.name}</p>
                        <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>Rs. {Number(order.total).toLocaleString()}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{getPaymentMethodLabel(order.paymentMethod)}</p>
                        {order.transactionId && (
                          <p className="text-xs text-muted-foreground">ID: {order.transactionId}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getOrderStatusBadgeVariant(order.status)}>
                        {getOrderStatusLabel(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          navigate({ to: '/admin/orders/$orderId', params: { orderId: order.id.toString() } })
                        }
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
