import { up } from "../../scripts/migrate-init-schema";

// Pre-generated challenge images and prompts
const challenges = [
  {
    image_url: "/images/1.png",
    prompt: "Happy Dog",
  },
  {
    image_url: "/images/2.png",
    prompt: "Space",
  },
  {
    image_url: "/images/3.png",
    prompt: "Food",
  },
  {
    image_url: "/images/4.png",
    prompt: "The Throne",
  },
  {
    image_url: "/images/5.png",
    prompt: "Vibes",
  },
  {
    image_url: "/images/6.png",
    prompt: "Red Aura",
  },
];

export async function initializeApp() {
  try {
    await up();
  } catch (err) {
    console.error("Initialization error:", err);
    throw err;
  }
}
