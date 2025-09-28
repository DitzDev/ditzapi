import { ThemeProvider } from "../ThemeProvider";
import { AccountLogin } from "../AccountLogin";

export default function AccountLoginExample() {
  return (
    <ThemeProvider>
      <div className="p-8">
        <AccountLogin />
      </div>
    </ThemeProvider>
  );
}