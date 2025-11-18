interface LoadingStateProps {
  title: string;
  description: string;
}

export function LoadingState({ title, description }: LoadingStateProps) {
  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="space-y-2">
        <div className="h-9 w-48 bg-muted/50 rounded-lg animate-pulse" />
        <div className="h-6 w-64 bg-muted/30 rounded-lg animate-pulse" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-36 bg-gradient-to-br from-card/50 to-muted/20 border border-border/50 rounded-xl animate-pulse backdrop-blur-sm"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export function TableLoadingState({ title, description }: LoadingStateProps) {
  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <div className="h-9 w-48 bg-muted/50 rounded-lg animate-pulse" />
          <div className="h-6 w-64 bg-muted/30 rounded-lg animate-pulse" />
        </div>
        <div className="h-11 w-80 bg-muted/30 rounded-lg animate-pulse" />
      </div>
      
      <div className="border border-border/50 rounded-xl overflow-hidden bg-card/30 backdrop-blur-sm">
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="h-12 bg-muted/20 rounded-lg animate-pulse"
              style={{ animationDelay: `${i * 75}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
