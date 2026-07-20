export const storyList = [
  {
    id: 1,
    title: 'Midnight Train',
    genre: 'Mystery',
    description: 'A suspenseful night ride where every choice changes the destination and reveals a new secret.',
  },
  {
    id: 2,
    title: 'The Lost Forest',
    genre: 'Adventure',
    description: 'Navigate enchanted paths, meet strange allies, and decide whether to rescue the hidden kingdom.',
  },
  {
    id: 3,
    title: 'Cyber City',
    genre: 'Sci-Fi',
    description: 'Explore a neon metropolis, hack your way through danger, and choose between rebellion or refuge.',
  },
  {
    id: 4,
    title: 'Sweet Revenge',
    genre: 'Romance',
    description: 'A tangled love story where forgiveness and desire collide at every crossroads.',
  },
];

export const storyGraph = {
  1: {
    id: 1,
    title: 'Midnight Train',
    description: 'A suspenseful night ride where every choice changes the destination and reveals a new secret.',
    startPassageId: 1,
    passages: {
      1: {
        id: 1,
        content: 'The train glides through the night, its carriages almost empty. You can either explore the dining car or stay in your compartment.',
        isEnding: false,
        choices: [
          { text: 'Head to the dining car', next: 2 },
          { text: 'Stay and listen to the tracks', next: 3 },
        ],
      },
      2: {
        id: 2,
        content: 'In the dim dining car, a stranger offers you a mysterious envelope. The hum of the engine makes the moment feel urgent.',
        isEnding: false,
        choices: [
          { text: 'Accept the envelope', next: 4 },
          { text: 'Decline and return to your compartment', next: 3 },
        ],
      },
      3: {
        id: 3,
        content: 'You close your eyes and the rhythmic clack of rails becomes a lullaby. The ride feels endless, and a new station appears out of nowhere.',
        isEnding: true,
        choices: [],
      },
      4: {
        id: 4,
        content: 'The envelope contains a map marked with a hidden carriage. You decide whether to follow it or ignore the stranger.',
        isEnding: false,
        choices: [
          { text: 'Follow the map to the hidden carriage', next: 5 },
          { text: 'Ignore it and stay on your current track', next: 3 },
        ],
      },
      5: {
        id: 5,
        content: 'You find the hidden carriage and discover the train is not what it seems. A new adventure begins beyond the glass door.',
        isEnding: true,
        choices: [],
      },
    },
  },
  2: {
    id: 2,
    title: 'The Lost Forest',
    description: 'Navigate enchanted paths, meet strange allies, and decide whether to rescue the hidden kingdom.',
    startPassageId: 1,
    passages: {
      1: {
        id: 1,
        content: 'You wake up in a dark forest. Two paths lie ahead.',
        isEnding: false,
        choices: [
          { text: 'Take the left path toward the river', next: 2 },
          { text: 'Follow the right path into the mist', next: 3 },
        ],
      },
      2: {
        id: 2,
        content: 'The river glows faintly. You meet a fox that says it can guide you further.',
        isEnding: true,
        choices: [],
      },
      3: {
        id: 3,
        content: 'Misty trees part to reveal a hidden clearing. The kingdom waits, but the air feels heavy with secrets.',
        isEnding: true,
        choices: [],
      },
    },
  },
  3: {
    id: 3,
    title: 'Cyber City',
    description: 'Explore a neon metropolis, hack your way through danger, and choose between rebellion or refuge.',
    startPassageId: 1,
    passages: {
      1: {
        id: 1,
        content: 'Neon signs flicker overhead as you stand in a crowded alley. A hacker offers you a choice: join the resistance or lay low.',
        isEnding: false,
        choices: [
          { text: 'Join the resistance', next: 2 },
          { text: 'Lay low and observe', next: 3 },
        ],
      },
      2: {
        id: 2,
        content: 'You are pulled into a secret mission to breach the corporate network. Every decision could expose you.',
        isEnding: true,
        choices: [],
      },
      3: {
        id: 3,
        content: 'You wait in the shadows and discover a hidden message left for you on a cracked screen.',
        isEnding: true,
        choices: [],
      },
    },
  },
  4: {
    id: 4,
    title: 'Sweet Revenge',
    description: 'A tangled love story where forgiveness and desire collide at every crossroads.',
    startPassageId: 1,
    passages: {
      1: {
        id: 1,
        content: 'A note appears on your door with two names. One is a forgotten love; the other is a chance for peace.',
        isEnding: false,
        choices: [
          { text: 'Reach out to the old flame', next: 2 },
          { text: 'Choose peace instead', next: 3 },
        ],
      },
      2: {
        id: 2,
        content: 'You text the old flame and wait for a reply that could reopen the past.',
        isEnding: true,
        choices: [],
      },
      3: {
        id: 3,
        content: 'You close the door and decide to focus on your own happiness. The ending feels bittersweet but earned.',
        isEnding: true,
        choices: [],
      },
    },
  },
};
