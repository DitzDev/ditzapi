import { ThemeProvider } from "../ThemeProvider";
import { Contact } from "../Contact";

export default function ContactExample() {
  return (
    <ThemeProvider>
      <Contact />
    </ThemeProvider>
  );
}