import { ThemeProvider } from "../ThemeProvider";
import { ApiList } from "../ApiList";

export default function ApiListExample() {
  return (
    <ThemeProvider>
      <div className="p-8">
        <ApiList />
      </div>
    </ThemeProvider>
  );
}