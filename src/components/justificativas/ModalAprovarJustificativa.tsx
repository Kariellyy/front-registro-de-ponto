import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface ModalAprovarJustificativaProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    status: "aprovada" | "rejeitada",
    observacoes?: string
  ) => Promise<void>;
  justificativaId: string;
}

export function ModalAprovarJustificativa({
  isOpen,
  onClose,
  onConfirm,
  justificativaId,
}: ModalAprovarJustificativaProps) {
  const [status, setStatus] = useState<"aprovada" | "rejeitada">("aprovada");
  const [observacoes, setObservacoes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm(status, observacoes || undefined);
      handleClose();
    } catch (error) {
      console.error("Erro ao aprovar justificativa:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setStatus("aprovada");
    setObservacoes("");
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Aprovar/Rejeitar Justificativa</DialogTitle>
          <DialogDescription>
            Defina o status da justificativa e adicione observações se
            necessário.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={status}
              onValueChange={(value: "aprovada" | "rejeitada") =>
                setStatus(value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aprovada">Aprovar</SelectItem>
                <SelectItem value="rejeitada">Rejeitar</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="observacoes">Observações (opcional)</Label>
            <Textarea
              id="observacoes"
              placeholder="Adicione observações sobre a decisão..."
              value={observacoes}
              onChange={(e) => setObservacoes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {status === "aprovada" ? "Aprovar" : "Rejeitar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
