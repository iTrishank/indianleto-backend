import type { Measurements } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface MeasurementsTableProps {
  measurements: Record<string, Measurements>;
  selectedSize?: string;
}

export function MeasurementsTable({ measurements, selectedSize }: MeasurementsTableProps) {
  const sizes = Object.keys(measurements);
  
  if (sizes.length === 0) {
    return null;
  }

  const measurementKeys = ["skirtLength", "bust", "waist", "hips"] as const;
  const measurementLabels: Record<string, string> = {
    skirtLength: "Skirt Length (cm)",
    bust: "Bust (cm)",
    waist: "Waist (cm)",
    hips: "Hips (cm)",
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Size Chart
      </h3>
      <div className="border rounded-lg overflow-hidden" data-testid="measurements-table">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Size</TableHead>
              {measurementKeys.map((key) => (
                <TableHead key={key} className="font-semibold text-center">
                  {measurementLabels[key]}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sizes.map((size) => {
              const isSelected = size === selectedSize;
              const sizeData = measurements[size];
              return (
                <TableRow 
                  key={size}
                  className={isSelected ? "bg-primary/10" : ""}
                  data-testid={`row-size-${size}`}
                >
                  <TableCell className={`font-semibold ${isSelected ? "text-primary" : ""}`}>
                    {size}
                  </TableCell>
                  {measurementKeys.map((key) => (
                    <TableCell key={key} className="text-center">
                      {sizeData[key] ?? "-"}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
