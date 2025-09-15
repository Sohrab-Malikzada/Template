import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { Upload, Download, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Product } from "@/data/mockData";

interface CSVImportProps {
  onImport: (products: Partial<Product>[]) => void;
}

interface ParsedProduct {
  name: string;
  sku: string;
  category: string;
  stockLevel: number;
  minStock: number;
  purchasePrice: number;
  salePrice: number;
  supplier: string;
  status: 'valid' | 'error';
  errors?: string[];
}

export function CSVImport({ onImport }: CSVImportProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const downloadTemplate = () => {
    const template = [
      ['Name', 'SKU', 'Category', 'Stock Level', 'Min Stock', 'Purchase Price', 'Sale Price', 'Supplier'],
      ['Wireless Mouse', 'WM-001', 'Electronics', '50', '10', '25.99', '49.99', 'Tech Supplier'],
      ['USB Cable', 'UC-002', 'Accessories', '100', '20', '5.99', '12.99', 'Cable Co'],
    ];

    const csvContent = template.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const parseCSV = (text: string): ParsedProduct[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    const expectedHeaders = ['name', 'sku', 'category', 'stock level', 'min stock', 'purchase price', 'sale price', 'supplier'];
    
    const data: ParsedProduct[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const product: ParsedProduct = {
        name: values[0] || '',
        sku: values[1] || '',
        category: values[2] || '',
        stockLevel: parseInt(values[3]) || 0,
        minStock: parseInt(values[4]) || 0,
        purchasePrice: parseFloat(values[5]) || 0,
        salePrice: parseFloat(values[6]) || 0,
        supplier: values[7] || '',
        status: 'valid',
        errors: []
      };

      // Validation
      const errors: string[] = [];
      if (!product.name) errors.push('Name is required');
      if (!product.sku) errors.push('SKU is required');
      if (!product.category) errors.push('Category is required');
      if (product.stockLevel < 0) errors.push('Stock level must be positive');
      if (product.minStock < 0) errors.push('Min stock must be positive');
      if (product.purchasePrice <= 0) errors.push('Purchase price must be positive');
      if (product.salePrice <= 0) errors.push('Sale price must be positive');
      if (!product.supplier) errors.push('Supplier is required');

      if (errors.length > 0) {
        product.status = 'error';
        product.errors = errors;
      }

      data.push(product);
    }

    return data;
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File",
        description: "Please upload a CSV file.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const text = await file.text();
      const parsed = parseCSV(text);
      setParsedData(parsed);
      
      const validCount = parsed.filter(p => p.status === 'valid').length;
      const errorCount = parsed.filter(p => p.status === 'error').length;
      
      toast({
        title: "File Parsed",
        description: `Found ${validCount} valid products, ${errorCount} with errors.`
      });
    } catch (error) {
      toast({
        title: "Parse Error",
        description: "Failed to parse CSV file. Please check the format.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImport = () => {
    const validProducts = parsedData.filter(p => p.status === 'valid');
    if (validProducts.length === 0) {
      toast({
        title: "No Valid Products",
        description: "Please fix the errors before importing.",
        variant: "destructive"
      });
      return;
    }

    const productsToImport = validProducts.map(p => ({
      name: p.name,
      sku: p.sku,
      category: p.category,
      stockLevel: p.stockLevel,
      minStock: p.minStock,
      purchasePrice: p.purchasePrice,
      salePrice: p.salePrice,
      supplier: p.supplier,
      lastRestocked: new Date().toISOString().split('T')[0]
    }));

    onImport(productsToImport);
    setIsOpen(false);
    setParsedData([]);
    
    toast({
      title: "Import Successful",
      description: `Successfully imported ${validProducts.length} products.`
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="shadow-soft hover:shadow-medium transition-smooth">
          <Upload className="h-4 w-4 mr-2" />
          Import CSV
        </Button>
      </DialogTrigger>
      <DialogContent className="gradient-card max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Import Products from CSV
          </DialogTitle>
          <DialogDescription>
            Upload a CSV file to bulk import products into your inventory
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="csv-file">Select CSV File</Label>
              <Input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="shadow-soft focus:shadow-glow transition-smooth"
                disabled={isLoading}
              />
            </div>
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={downloadTemplate}
                className="shadow-soft hover:shadow-medium transition-smooth"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Template
              </Button>
            </div>
          </div>

          {parsedData.length > 0 && (
            <Card className="gradient-card">
              <CardHeader>
                <CardTitle className="text-lg">Preview Data</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>SKU</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Prices</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead>Errors</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedData.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            {product.status === 'valid' ? (
                              <CheckCircle className="h-4 w-4 text-success" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-destructive" />
                            )}
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.sku}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>{product.stockLevel}/{product.minStock}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>Buy: ${product.purchasePrice}</div>
                              <div>Sell: ${product.salePrice}</div>
                            </div>
                          </TableCell>
                          <TableCell>{product.supplier}</TableCell>
                          <TableCell>
                            {product.errors && product.errors.length > 0 && (
                              <div className="text-xs text-destructive">
                                {product.errors.join(', ')}
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleImport}
            disabled={parsedData.length === 0 || parsedData.every(p => p.status === 'error')}
            className="gradient-primary"
          >
            Import Products ({parsedData.filter(p => p.status === 'valid').length})
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}