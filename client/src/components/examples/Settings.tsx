import { ThemeProvider } from "../ThemeProvider";
import { Settings } from "../Settings";

export default function SettingsExample() {
  return (
    <ThemeProvider>
      <div className="p-8">
        <Settings />
      </div>
    </ThemeProvider>
  );
}