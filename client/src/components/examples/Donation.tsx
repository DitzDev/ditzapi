import { ThemeProvider } from "../ThemeProvider";
import { Donation } from "../Donation";

export default function DonationExample() {
  return (
    <ThemeProvider>
      <Donation />
    </ThemeProvider>
  );
}