import { useApp } from "@/contexts/AppContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Measurements {
  skirtLength?: number;
  bust?: number;
  waist?: number;
  hips?: number;
}

interface MeasurementsTableProps {
  measurements: Record<string, Measurements>;
  selectedSize?: string;
}

export function MeasurementsTable({ measurements, selectedSize }: MeasurementsTableProps) {
  const { t } = useApp();
  const sizes = Object.keys(measurements).filter(key => measurements[key] !== undefined);
  
  if (sizes.length === 0) {
    return null;
  }

  const measurementKeys = ["skirtLength", "bust", "waist", "hips"] as const;
  
  const getMeasurementLabel = (key: string) => {
    const labels: Record<string, string> = {
      skirtLength: `${t("measurements.skirtLength")} (${t("measurements.cm")})`,
      bust: `${t("measurements.bust")} (${t("measurements.cm")})`,
      waist: `${t("measurements.waist")} (${t("measurements.cm")})`,
      hips: `${t("measurements.hips")} (${t("measurements.cm")})`,
    };
    return labels[key] || key;
  };

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {t("product.sizeMeasurements")}
      </h3>
      <div className="border rounded-lg overflow-hidden" data-testid="measurements-table">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">{t("product.size")}</TableHead>
              {measurementKeys.map((key) => (
                <TableHead key={key} className="font-semibold text-center">
                  {getMeasurementLabel(key)}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {sizes.map((size) => {
              const isSelected = size === selectedSize;
              const sizeData = measurements[size];
              if (!sizeData) return null;
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
