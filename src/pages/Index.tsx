import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WheelSpinner } from "@/components/WheelSpinner";
import { Card } from "@/components/ui/card";
import { X, Save, Upload } from "lucide-react";
import { toast } from "sonner";

const Index = () => {
  const [names, setNames] = useState<string[]>([]);
  const [inputName, setInputName] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [drawnNames, setDrawnNames] = useState<string[]>([]);
  const [allNames, setAllNames] = useState<string[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audio = new Audio("/vsaude-daily-spinner/bell.mp3");

  useEffect(() => {
    const savedNames = localStorage.getItem("dailyNames");
    if (savedNames) {
      const parsed = JSON.parse(savedNames);
      setNames(parsed);
      setAllNames(parsed);
    }
  }, []);

  useEffect(() => {
    if (showResult && selectedName) {
      audioRef.current = audio;
      audio.volume = 0.5;
      audio.play().catch((error) => {
        console.error("Erro ao tocar áudio:", error);
      });
    }
  }, [showResult, selectedName]);

  const saveNames = () => {
    localStorage.setItem("dailyNames", JSON.stringify(names));
    toast.success("Lista salva com sucesso!");
  };

  const loadNames = () => {
    const savedNames = localStorage.getItem("dailyNames");
    if (savedNames) {
      setNames(JSON.parse(savedNames));
      toast.success("Lista carregada!");
    } else {
      toast.error("Nenhuma lista salva encontrada!");
    }
  };

  const addName = () => {
    if (inputName.trim()) {
      const newNames = [...names, inputName.trim()];
      setNames(newNames);
      setAllNames(newNames);
      setInputName("");
      toast.success("Nome adicionado!");
    }
  };

  const removeName = (index: number) => {
    setNames(names.filter((_, i) => i !== index));
  };

  const spinWheel = () => {
    if (names.length === 0) {
      toast.error("Adicione pelo menos um nome!");
      return;
    }

    setIsSpinning(true);
    setShowResult(false);
    
    const randomIndex = Math.floor(Math.random() * names.length);
    setSelectedIndex(randomIndex);

    setTimeout(() => {
      const winner = names[randomIndex];
      setSelectedName(winner);
      setIsSpinning(false);
      setShowResult(true);
    }, 2000);
  };

  const nextSpin = () => {
    if (selectedName) {
      setDrawnNames([...drawnNames, selectedName]);
      setNames(names.filter(name => name !== selectedName));
      setSelectedName(null);
      setShowResult(false);
      
      if (names.length === 1) {
        toast.info("Todos os nomes foram sorteados!");
      }
    }
  };

  const resetWheel = () => {
    setNames(allNames);
    setDrawnNames([]);
    setSelectedName(null);
    setShowResult(false);
    setSelectedIndex(-1);
    toast.success("Roleta reiniciada!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4 relative">
      {/* Imagem no canto superior esquerdo */}
      <img
        src="/vsaude-daily-spinner/christmas_header.png"
        alt="Christmas Header"
        className="fixed top-0 left-0 z-40 pointer-events-none"
        style={{ maxHeight: "150px" }}
      />
      
      {/* Imagem no canto superior direito (invertida) */}
      <img
        src="/vsaude-daily-spinner/christmas_header.png"
        alt="Christmas Header"
        className="fixed top-0 right-0 z-40 pointer-events-none"
        style={{ maxHeight: "150px", transform: "scaleX(-1)" }}
      />
      
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-secondary">Roleta da Daily</h1>
          <p className="text-xl text-muted-foreground">VSaúde</p>
        </div>

        {!showResult ? (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <Card className="p-6 space-y-4">
                <h2 className="text-xl font-semibold text-foreground">Adicionar Nomes</h2>
                <div className="flex gap-2">
                  <Input
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addName()}
                    placeholder="Digite um nome..."
                    className="flex-1"
                  />
                  <Button onClick={addName} className="bg-primary hover:bg-primary/90">
                    Adicionar
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={saveNames}
                    disabled={names.length === 0}
                    variant="outline"
                    className="flex-1"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Lista
                  </Button>
                  <Button
                    onClick={loadNames}
                    variant="outline"
                    className="flex-1"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Carregar Lista
                  </Button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {names.map((name, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <span className="text-foreground">{name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeName(index)}
                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={spinWheel}
                  disabled={names.length === 0 || isSpinning}
                  className="w-full bg-secondary hover:bg-secondary/90"
                  size="lg"
                >
                  {isSpinning ? "Girando..." : "Girar Roleta"}
                </Button>

                {drawnNames.length > 0 && (
                  <Button
                    onClick={resetWheel}
                    variant="outline"
                    className="w-full"
                    size="lg"
                  >
                    Resetar Roleta
                  </Button>
                )}
              </Card>

              {drawnNames.length > 0 && (
                <Card className="p-6 space-y-4">
                  <h2 className="text-xl font-semibold text-foreground">Nomes Sorteados</h2>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {drawnNames.map((name, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-muted rounded-lg animate-fade-in"
                      >
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                          {index + 1}
                        </span>
                        <span className="text-foreground font-medium">{name}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            <div className="flex items-center justify-center">
              {names.length > 0 ? (
                <WheelSpinner
                  names={names}
                  isSpinning={isSpinning}
                  selectedName={selectedName}
                  selectedIndex={selectedIndex}
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <p>Adicione nomes para começar</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <Card className="p-12 text-center space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Nome Sorteado:</h2>
              <div className="text-6xl font-bold text-primary animate-fade-in">
                {selectedName}
              </div>
            </div>
            <Button
              onClick={nextSpin}
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-lg px-12"
            >
              Próximo
            </Button>
          </Card>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(${720 + Math.random() * 360}deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Index;
