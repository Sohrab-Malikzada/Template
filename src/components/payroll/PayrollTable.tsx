import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Clock, CheckCircle, XCircle } from "lucide-react";

interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  position: string;
  baseSalary: number;
  bonus: number;
  deductions: number;
  netPay: number;
  paymentDate: string;
  status: "paid" | "pending" | "processing";
  paymentMethod: string;
  bonusReason?: string;
  advances: { amount: number; date: string; reason: string }[];
}

interface PayrollTableProps {
  payrollRecords: PayrollRecord[];
  onViewDetails?: (record: PayrollRecord) => void;
  onEditRecord?: (record: PayrollRecord) => void;
}

export function PayrollTable({ payrollRecords, onViewDetails, onEditRecord }: PayrollTableProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'pending':
        return <XCircle className="h-4 w-4 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default';
      case 'processing':
        return 'secondary';
      case 'pending':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-soft">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="font-semibold">Employee</TableHead>
            <TableHead className="font-semibold">Position</TableHead>
            <TableHead className="font-semibold">Base Salary</TableHead>
            <TableHead className="font-semibold">Bonus</TableHead>
            <TableHead className="font-semibold">Deductions</TableHead>
            <TableHead className="font-semibold">Net Pay</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold">Payment Date</TableHead>
            <TableHead className="font-semibold">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payrollRecords.map((record) => (
            <TableRow 
              key={record.id} 
              className="hover:bg-muted/20 transition-smooth border-b border-muted/30"
            >
              <TableCell>
                <div>
                  <div className="font-medium text-foreground">{record.employeeName}</div>
                  <div className="text-sm text-muted-foreground">ID: {record.employeeId}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className="font-normal">
                  {record.position}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="font-medium text-primary">؋{record.baseSalary.toLocaleString()}</span>
              </TableCell>
              <TableCell>
                {record.bonus > 0 ? (
                  <div className="space-y-1">
                    <span className="text-success font-medium">+؋{record.bonus.toLocaleString()}</span>
                    {record.bonusReason && (
                      <div className="text-xs text-muted-foreground">{record.bonusReason}</div>
                    )}
                  </div>
                ) : (
                  <span className="text-muted-foreground">؋0</span>
                )}
              </TableCell>
              <TableCell>
                <span className="text-warning font-medium">-؋{record.deductions.toLocaleString()}</span>
                {record.advances.length > 0 && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {record.advances.length} advance(s)
                  </div>
                )}
              </TableCell>
              <TableCell>
                <span className="font-semibold text-lg text-foreground">
                  ؋{record.netPay.toLocaleString()}
                </span>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={getStatusVariant(record.status)}
                  className="flex items-center gap-1 w-fit"
                >
                  {getStatusIcon(record.status)}
                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-muted-foreground">
                {new Date(record.paymentDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onViewDetails?.(record)}
                    className="hover:bg-primary/10 hover:text-primary transition-smooth"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEditRecord?.(record)}
                    className="hover:bg-warning/10 hover:text-warning transition-smooth"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}