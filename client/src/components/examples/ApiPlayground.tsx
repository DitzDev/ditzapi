import { ThemeProvider } from "../ThemeProvider";
import { ApiPlayground } from "../ApiPlayground";

export default function ApiPlaygroundExample() {
  return (
    <ThemeProvider>
      <div className="p-8">
        <ApiPlayground apiId="youtube-dl" />
      </div>
    </ThemeProvider>
  );
}