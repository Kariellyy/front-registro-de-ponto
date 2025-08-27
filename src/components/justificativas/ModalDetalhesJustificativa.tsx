import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { justificativasService } from "@/services/justificativas.service";
import { Justificativa } from "@/types/justificativa";
import { Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { DetalhesJustificativa } from "./DetalhesJustificativa";

interface ModalDetalhesJustificativaProps {
  isOpen: boolean;
  onClose: () => void;
  justificativaId: string;
}

export function ModalDetalhesJustificativa({
  isOpen,
  onClose,
  justificativaId,
}: ModalDetalhesJustificativaProps) {
  const [justificativa, setJustificativa] = useState<Justificativa | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && justificativaId) {
      carregarJustificativa();
    }
  }, [isOpen, justificativaId]);

  const carregarJustificativa = async () => {
    try {
      setLoading(true);
      const data = await justificativasService.buscarJustificativaPorId(
        justificativaId
      );
      setJustificativa(data);
    } catch (error) {
      console.error("Erro ao carregar justificativa:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setJustificativa(null);
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Detalhes da Justificativa</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : justificativa ? (
            <DetalhesJustificativa justificativa={justificativa} />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Justificativa não encontrada
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
