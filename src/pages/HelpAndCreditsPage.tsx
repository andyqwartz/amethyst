import React from 'react';
import { Card } from "@/components/ui/card";

export default function HelpAndCreditsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Help & Credits</h1>
        <p className="mb-2">This application allows you to generate images based on prompts using advanced AI technology.</p>
        <h2 className="text-xl font-semibold mt-4">How to Use</h2>
        <p className="mb-2">1. Enter a prompt in the input field.</p>
        <p className="mb-2">2. Adjust the settings as needed.</p>
        <p className="mb-2">3. Click on the "Generate" button to create your image.</p>
        <h2 className="text-xl font-semibold mt-4">Credits</h2>
        <p className="mb-2">This project is powered by various open-source libraries and APIs.</p>
        <p className="mb-2">Special thanks to the contributors and the community for their support.</p>
      </Card>
    </div>
  );
}
