export interface Action {
  id: string;
  text: string;
}

export interface GameState {
  sceneDescription: string;
  imagePrompt: string;
  actions: Action[];
  characterStatus: string;
  health: number;
  gameOver: boolean;
  gameWon: boolean;
  storyRecap: string;
  generateImage: boolean;
  inventory: string[];
}