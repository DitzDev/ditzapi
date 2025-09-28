import { ThemeProvider } from "../ThemeProvider";
import { Header } from "../Header";

export default function HeaderExample() {
  return (
    <ThemeProvider>
      <div>
        <Header isLanding={true} />
        <div className="p-8">
          <p className="text-muted-foreground">Landing page header example</p>
        </div>
      </div>
    </ThemeProvider>
  );
}