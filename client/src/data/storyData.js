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
  {
    id: 5,
    title: 'The Last Ferry',
    genre: 'Romance',
    description: "A missed ferry, a stranger's boat, and a storm that changes everything.",
  },
];

export const storyGraph = {
  1: {
    id: 1,
    title: 'Midnight Train',
    genre: 'Mystery',
    author: 'Questwyst Team',
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
    genre: 'Adventure',
    author: 'Questwyst Team',
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
    genre: 'Sci-Fi',
    author: 'Questwyst Team',
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
    genre: 'Romance',
    author: 'Questwyst Team',
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
        content: 'You text the old flame and wait for a reply that could reopen the past. It comes faster than you expect: "I wondered if I\'d ever hear from you again." Your thumb hovers over the keyboard, unsure how much of yourself to hand back over.',
        isEnding: false,
        choices: [
          { text: 'Answer honestly about why you reached out now', next: 4 },
          { text: 'Keep the reply light and see where it goes', next: 5 },
        ],
      },
      3: {
        id: 3,
        content: 'You close the door and decide to focus on your own happiness. The house goes quiet in a way it hasn\'t in months. Then, twenty minutes later, there\'s a knock — soft, uncertain, like whoever\'s on the other side isn\'t sure they should be there either.',
        isEnding: false,
        choices: [
          { text: 'Answer the knock', next: 6 },
          { text: 'Let the silence hold and stay inside', next: 7 },
        ],
      },
      4: {
        id: 4,
        content: 'You tell them the truth: that the note scared you, that you weren\'t ready to want this again but wanted it anyway. There\'s a long pause on the other end. "Good," they finally write back. "Because I never really stopped." It isn\'t simple, and it isn\'t fast, but for the first time in a long time, it feels real.',
        isEnding: true,
        choices: [],
      },
      5: {
        id: 5,
        content: 'You keep it easy — a joke, a memory, nothing too heavy. They match your energy, and for a few days it\'s fun, weightless, almost like old times. But neither of you brings up what the note really meant, and eventually the messages just quietly stop, leaving you with a smile and a question you never asked out loud.',
        isEnding: true,
        choices: [],
      },
      6: {
        id: 6,
        content: 'You open the door and there they are, hands in their pockets, looking like they rehearsed something on the walk over and forgot all of it. "I know you chose peace," they say. "I just needed you to know I\'m not the reason you have to lose it." You don\'t know yet what this is. But you don\'t close the door either.',
        isEnding: true,
        choices: [],
      },
      7: {
        id: 7,
        content: 'You let the knock go unanswered and sit with the quiet a while longer, and something in you finally exhales. Whoever was on the other side of that door doesn\'t knock again. Weeks later, you realize you haven\'t thought about the note in days — not because you forgot, but because you don\'t need it to feel whole anymore.',
        isEnding: true,
        choices: [],
      },
    },
  },
  5: {
    id: 5,
    title: "The Last Ferry",
    genre: "Romance",
    author: "Questwyst Team",
    description: "A missed ferry, a stranger's boat, and a storm that changes everything.",
    startPassageId: 1,
    passages: {
      1: {
        id: 1,
        content: "Mara had missed the last ferry to the mainland, or so she thought, until she saw a stranger waving frantically from the dock, holding the rope for a boat that clearly wasn't supposed to still be there. \"Captain's off sick,\" he said, breathless, rain slicking his hair to his forehead. \"I can get us across, but I need a second pair of hands.\" She had a flight to catch in the morning and every reason to say no. Instead she stepped over the gap between dock and deck, and the boat lurched forward into the dark water, carrying them both somewhere neither had planned to go.",
        isEnding: false,
        choices: [
          { text: "Ask him why he really needs help crossing tonight.", next: 2 },
          { text: "Grab the second rope and start rowing without asking questions.", next: 3 },
        ],
      },
      2: {
        id: 2,
        content: "\"Why does it have to be tonight?\" Mara asked, bracing herself against the wheel as the boat rocked. The stranger \u2014 Dane, he'd finally told her, shouting it over the wind \u2014 went quiet for a moment before answering. \"My sister's getting married at sunrise,\" he said. \"She thinks I'm not coming. I told her years ago I'd never forgive the man she's marrying, and I meant it, until about six hours ago.\" Mara studied his face in the weak cabin light, the way his jaw tightened like the words cost him something. \"So what changed?\" she asked. He almost laughed. \"You did, actually. Watching you jump on this boat for a stranger made me realize I've spent three years being too proud to jump on one myself.\" The rain eased. The lights of the mainland blinked into view ahead of them, closer now than either of them wanted to admit.",
        isEnding: false,
        choices: [
          { text: "Offer to come with him to the wedding.", next: 4 },
          { text: "Wish him luck and let the moment end at the dock.", next: 5 },
        ],
      },
      3: {
        id: 3,
        content: "Mara didn't ask. She just grabbed the second oar and matched his rhythm, stroke for stroke, until the questions stopped mattering and the boat found its own steady heartbeat through the dark water. Neither of them spoke for a long while \u2014 there wasn't room for words between the wind and the effort \u2014 but somewhere between the third mile and the fourth, something shifted. He started calling out the current before she had to ask. She started leaning into the turns before he warned her. By the time the mainland lights broke through the fog, they were moving like they'd done this a hundred times before, not once. He cut the last stretch of water in silence, then finally looked at her, soaked and breathless and grinning despite herself. \"You never did ask why,\" he said. \"I know,\" she said. \"Ask me again once we're on dry land.\"",
        isEnding: false,
        choices: [
          { text: "Ask him now that you've made it to shore.", next: 6 },
          { text: "Let the mystery stay a mystery, at least for tonight.", next: 7 },
        ],
      },
      4: {
        id: 4,
        content: "\"Come with me,\" Dane said, before Mara had even finished offering. \"I mean it. Show up soaked and uninvited with me, that'll give my sister something to talk about besides the fact that I almost didn't come at all.\" So she did. The wedding was small, seaside, string lights strung between porch posts that hadn't dried from the storm. His sister cried when she saw him, then laughed when she saw Mara standing beside him in someone's borrowed cardigan, and didn't ask a single question about who she was \u2014 just pulled her into the receiving line like she'd always been meant to be there.",
        isEnding: false,
        choices: [
          { text: "Stay through the whole reception and dance until the lights come down.", next: 8 },
          { text: "Slip away quietly before the night gets too real.", next: 9 },
        ],
      },
      5: {
        id: 5,
        content: "\"Go,\" Mara said. \"Don't keep her waiting for you twice in one lifetime.\" Dane looked at her a moment too long before he nodded, like he was memorizing something. He didn't run up the dock right away. Instead he tore a corner off the ferry schedule still crumpled in his jacket pocket, scrawled a number across it in pen that barely worked, and pressed it into her hand. \"In case the story's not over,\" he said, and then he was gone, jogging up toward the lights and the music already drifting down from the house on the hill. Mara stood on the dock a long while after, turning the damp scrap of paper over in her fingers.",
        isEnding: false,
        choices: [
          { text: "Call the number the very next chance she gets.", next: 10 },
          { text: "Tuck the number away and wait, unsure if she's ready.", next: 11 },
        ],
      },
      6: {
        id: 6,
        content: "They pulled the boat up onto the sand, and Mara didn't wait this time. \"Okay,\" she said, still catching her breath. \"Ask me again \u2014 why tonight?\" He sat down heavily on the overturned hull, rain finally letting up around them. \"My father's selling the boathouse tomorrow,\" he said. \"Thirty years in the family, gone to some developer who wants to put condos where the dock is. I couldn't let it go without seeing it float one more time. Couldn't do it alone, either, if I'm honest.\" Mara looked back at the water, at the boat that had somehow, impossibly, carried them both somewhere neither of them expected.",
        isEnding: false,
        choices: [
          { text: "Offer to help him find a way to save it.", next: 12 },
          { text: "Let him have this moment to grieve it, quietly, without fixing it.", next: 13 },
        ],
      },
      7: {
        id: 7,
        content: "\"Let it stay a mystery, then,\" Mara said, and something in his shoulders eased, like she'd given him permission to keep one thing for himself a little longer. They hauled the boat up onto the sand together, still not speaking, and when it was done he just looked at her \u2014 really looked, the way no one looks at a stranger. \"Same time next week?\" he asked, half joking, mostly not. \"There won't be a missed ferry next week,\" she pointed out. \"There's always a missed ferry,\" he said, \"if you're willing to miss it.\"",
        isEnding: false,
        choices: [
          { text: "Show up next week, ferry schedule be damned.", next: 14 },
          { text: "Let life happen and see if fate brings them back together.", next: 15 },
        ],
      },
      8: {
        id: 8,
        content: "They danced past the point where either of them was counting songs, past the point where his sister stopped teasing them about it and just smiled instead. Somewhere around midnight, forehead to forehead under string lights that had finally dried, Dane asked the question neither of them had said out loud yet: what happens after tonight, when the ferry runs again and real life comes looking for both of them?",
        isEnding: false,
        choices: [
          { text: "Ask him to come visit her city next.", next: 16 },
          { text: "Let tonight be enough, no promises attached.", next: 17 },
        ],
      },
      9: {
        id: 9,
        content: "Mara left before the toasts got too sentimental, slipping out the side door with her shoes in her hand and a note folded on the gift table: *Thank you for the boat. And the wedding. And everything in between.* She was halfway down the gravel drive when she heard the door bang open behind her.",
        isEnding: false,
        choices: [
          { text: "Let him catch up to her on the road.", next: 18 },
          { text: "Keep walking and let him choose whether to follow.", next: 19 },
        ],
      },
      10: {
        id: 10,
        content: "She called the number two days later, heart going stupid and fast while it rang. He picked up on the second ring like he'd been waiting by the phone the whole time, which \u2014 as it turned out \u2014 he basically had been.",
        isEnding: false,
        choices: [
          { text: "Suggest meeting up for coffee this weekend.", next: 20 },
          { text: "Keep it to phone calls for now, feeling out the awkward space between them.", next: 21 },
        ],
      },
      11: {
        id: 11,
        content: "The number sat in her coat pocket for three weeks, worn soft at the folds from how many times she'd almost dialed it. She told herself she was being sensible. She told herself a lot of things, mostly late at night, mostly unconvincing.",
        isEnding: false,
        choices: [
          { text: "Finally call, three weeks late and no less nervous.", next: 22 },
          { text: "Lose the number in the wash and take it as a sign.", next: 23 },
        ],
      },
      12: {
        id: 12,
        content: "\"There's a preservation board,\" Mara said, already pulling out her phone. \"Historic structures, waterfront zoning \u2014 there's always a process, if you're willing to fight it.\" Dane stared at her like she'd offered him something he didn't know he was allowed to want. They spent the next two weeks buried in permit paperwork and city council meetings neither of them had ever imagined attending together.",
        isEnding: false,
        choices: [
          { text: "Push through and see if the fight actually works.", next: 24 },
          { text: "Lose the appeal, but find something worth keeping anyway.", next: 25 },
        ],
      },
      13: {
        id: 13,
        content: "Mara didn't say anything else. She just sat beside him on the overturned hull until the sun came all the way up, her shoulder against his, saying nothing because nothing needed saying. She left her own number folded into his jacket pocket before she caught her cab to the airport.",
        isEnding: false,
        choices: [
          { text: "Check in on him a week later, gently.", next: 26 },
          { text: "Wait and see if he reaches out first.", next: 27 },
        ],
      },
      14: {
        id: 14,
        content: "She showed up the following week, umbrella in hand, half-expecting the dock to be empty and the whole thing to have been a fever dream brought on by bad weather and worse judgment.",
        isEnding: false,
        choices: [
          { text: "Find him already there, waiting.", next: 28 },
          { text: "Find him arriving late, out of breath, like he almost didn't come either.", next: 29 },
        ],
      },
      15: {
        id: 15,
        content: "A work trip came up. Then a family thing. Then it had been a month, and Mara stood in her kitchen holding her phone, wondering if there was any version of a text message that could explain why she'd disappeared on someone she'd never even exchanged numbers with.",
        isEnding: false,
        choices: [
          { text: "Find some way to get word to him, however impractical.", next: 30 },
          { text: "Accept that she has no way to reach him and let the weeks pass.", next: 31 },
        ],
      },
      16: {
        id: 16,
        content: "\"Come visit,\" she said, before she could think better of it. \"My city's not half as charming as this island, but I promise the coffee's good and I make an excellent tour guide.\" He grinned like she'd handed him a gift. \"Is that an invitation or a dare?\" \"Both,\" she said. \"I dare you to actually show up.\"",
        isEnding: false,
        choices: [
          { text: "He shows up, exactly when he said he would.", next: 32 },
          { text: "Something comes up and he has to postpone.", next: 33 },
        ],
      },
      17: {
        id: 17,
        content: "\"Let's not make promises we don't know how to keep yet,\" Mara said softly, and Dane nodded like he understood exactly what she meant \u2014 not an ending, just an honest pause. They said goodbye at the ferry dock the way people say goodbye when they mean it but don't know what comes next.",
        isEnding: false,
        choices: [
          { text: "Months later, he shows up on her side of the water unannounced.", next: 34 },
          { text: "The night stays exactly what it was \u2014 one perfect, unrepeated thing.", next: 35 },
        ],
      },
      18: {
        id: 18,
        content: "\"You forgot something,\" Dane said, catching up to her on the gravel road, breathless, holding up her borrowed cardigan like it was the most obvious excuse in the world. \"That's a terrible reason to chase someone down a dark road,\" Mara said. \"I'm aware,\" he said. \"I couldn't think of a better one fast enough.\"",
        isEnding: false,
        choices: [
          { text: "She lets him walk her the rest of the way, slowly.", next: 36 },
          { text: "She teases him the whole way but doesn't slow down for him.", next: 37 },
        ],
      },
      19: {
        id: 19,
        content: "He didn't chase her. He stood in the doorway watching her walk down the drive, holding the note she'd left, understanding \u2014 the way you understand things you don't like \u2014 that some people need to leave on their own terms, and chasing her would only prove he hadn't been listening.",
        isEnding: false,
        choices: [
          { text: "Months later, he tracks her down through his sister.", next: 38 },
          { text: "He never finds her again, but keeps the note for years.", next: 39 },
        ],
      },
      20: {
        id: 20,
        content: "The coffee shop was too loud and the espresso was burnt and neither of them noticed, too busy filling in three weeks of everything they hadn't said on the phone. He still had the ferry schedule in his jacket pocket, the ink smudged now from handling.",
        isEnding: false,
        choices: [
          { text: "The coffee turns into dinner, and dinner turns into something real.", next: 40 },
          { text: "It's a lovely afternoon, but the spark just isn't quite there yet.", next: 41 },
        ],
      },
      21: {
        id: 21,
        content: "The calls stayed a little stilted for weeks \u2014 too much silence, too many half-finished sentences \u2014 but neither of them hung up early, and neither of them stopped calling, which felt, in its own clumsy way, like its own kind of answer.",
        isEnding: false,
        choices: [
          { text: "They finally push through the awkwardness and set a real date.", next: 42 },
          { text: "The calls quietly taper off, no hard feelings, no big goodbye.", next: 43 },
        ],
      },
      22: {
        id: 22,
        content: "She dialed the number with her thumb shaking, half-convinced it would be disconnected, half-hoping it would be. It rang twice. \"I wondered if you'd lost this,\" Dane said, like no time had passed at all, like he'd been carrying the wondering around with him the whole three weeks too.",
        isEnding: false,
        choices: [
          { text: "He's thrilled to hear from her, no hesitation at all.", next: 44 },
          { text: "He sounds warm but distant, like he'd started to move on.", next: 45 },
        ],
      },
      23: {
        id: 23,
        content: "The number went through the wash with her coat, the ink bleeding into an unreadable smear. Mara told herself it was a sign, packed the memory away neatly, and went back to her life \u2014 mostly convinced, on most days, that she'd made peace with it.",
        isEnding: false,
        choices: [
          { text: "Fate intervenes and puts them back in the same place, unexpectedly.", next: 46 },
          { text: "She never sees him again, but never quite regrets the missed ferry either.", next: 47 },
        ],
      },
      24: {
        id: 24,
        content: "The preservation board hearing ran three hours long, and by the end of it, the boathouse had a historic designation and a fighting chance. Dane hugged her right there in the hallway, in front of the whole zoning committee, like he'd forgotten anyone else was in the room.",
        isEnding: false,
        choices: [
          { text: "They save it, and something more starts between them too.", next: 48 },
          { text: "They save it, but the stress of the fight leaves things complicated.", next: 49 },
        ],
      },
      25: {
        id: 25,
        content: "The appeal was denied. The boathouse sold anyway, condos and all, exactly like the letter had said it would three months ago. But Dane didn't look at the empty lot the way Mara expected him to \u2014 he looked at her instead, like the fight had given him something the boathouse never could have.",
        isEnding: false,
        choices: [
          { text: "Losing it together, they find something steadier in each other.", next: 50 },
          { text: "They part ways gracefully, glad to have tried, no regrets between them.", next: 51 },
        ],
      },
      26: {
        id: 26,
        content: "A week later, Mara called the number she'd left in his pocket, half-expecting it to ring out. \"I was starting to think you'd changed your mind,\" Dane said, and there was real relief in his voice, the kind that's hard to fake over a phone line.",
        isEnding: false,
        choices: [
          { text: "The check-in turns into something real starting.", next: 52 },
          { text: "He's grateful for the call but not ready for more yet, and that's okay too.", next: 53 },
        ],
      },
      27: {
        id: 27,
        content: "She waited. Weeks passed with nothing, and Mara told herself that was fine, that was fair, that was what she'd offered him \u2014 space, no strings, no expectations. Then one evening her phone lit up with a number she hadn't saved but somehow already knew.",
        isEnding: false,
        choices: [
          { text: "He finally reaches out, and it's worth the wait.", next: 54 },
          { text: "He never calls, and she gently, genuinely, lets it go.", next: 55 },
        ],
      },
      28: {
        id: 28,
        content: "He was there before she was, sitting on the overturned hull like he'd never left, like a week hadn't passed at all. \"You actually came,\" he said, and it wasn't a question, exactly, but it sounded like he'd been holding his breath for it anyway.",
        isEnding: false,
        choices: [
          { text: "A real, steady romance starts to take shape from here.", next: 56 },
          { text: "It becomes their thing \u2014 no labels, just a standing weekly ritual.", next: 57 },
        ],
      },
      29: {
        id: 29,
        content: "He arrived ten minutes late, soaked through, having nearly talked himself out of coming twice on the walk over. \"I almost didn't,\" he admitted. \"Me too,\" Mara said, \"for what it's worth. Glad we're both bad at listening to ourselves.\"",
        isEnding: false,
        choices: [
          { text: "The near-miss makes them finally talk honestly about what this is.", next: 58 },
          { text: "He's late enough that she'd already left \u2014 but this time, she leaves a note.", next: 59 },
        ],
      },
      30: {
        id: 30,
        content: "She didn't have his number, but she remembered the name of his sister, and his sister, it turned out, was more than happy to pass along a message: *Sorry about last week. Same dock, this Friday, if the offer still stands.*",
        isEnding: false,
        choices: [
          { text: "The message reaches him, and he waits for the makeup date.", next: 60 },
          { text: "The message gets garbled somewhere along the way, but the hope survives it.", next: 61 },
        ],
      },
      31: {
        id: 31,
        content: "Weeks turned into a couple of months. Mara stopped checking the dock every Friday, mostly. Told herself it had been one strange, lovely night and nothing more, the way you tell yourself a lot of things you don't quite believe.",
        isEnding: false,
        choices: [
          { text: "A chance encounter somewhere unexpected brings them back together.", next: 62 },
          { text: "Their paths never cross again, though she thinks of that night often.", next: 63 },
        ],
      },
      32: {
        id: 32,
        content: "He showed up exactly when he said he would, standing outside her building with a bag over one shoulder and a nervous, hopeful look she recognized because she'd been wearing it all week too. \"Terrible tour guide so far,\" he said, glancing around, \"you didn't even meet me at the airport.\" \"Give me a chance,\" she said, already reaching for his hand. \"The ferry misses only happen once a story.\" Three years later, they'd tell people it started with a boat neither of them was supposed to be on, and somehow that was always the part that made people believe the rest of it.",
        isEnding: true,
        choices: [],
      },
      33: {
        id: 33,
        content: "The trip got pushed twice \u2014 a shift he couldn't cover, a family thing that ran long \u2014 and Mara told herself it didn't mean anything, even as the silence between calls stretched a little longer each time. When he finally did make it, months later than planned, he showed up with flowers and an apology longer than the flight itself. \"I should've just gotten on the boat,\" he said, echoing the words she never told him she'd been thinking too. It wasn't the visit either of them had imagined. It was better, in the stubborn, complicated way things are better when you almost lose them first.",
        isEnding: true,
        choices: [],
      },
      34: {
        id: 34,
        content: "Four months after the wedding, Mara opened her door to find Dane standing on her welcome mat looking like he'd rehearsed something and forgotten all of it the second she appeared. \"I know we said no promises,\" he said. \"I'm bad at keeping that one.\" She laughed before she could stop herself, mostly out of relief, and stepped aside to let him in. Some nights you say goodbye meaning it, and some nights the story simply refuses to be finished yet \u2014 and this, it turned out, was one of those nights.",
        isEnding: true,
        choices: [],
      },
      35: {
        id: 35,
        content: "They never saw each other again after that wedding, and for a long time Mara wondered if that made the whole thing smaller somehow, a story that never got to finish. It didn't. Years later, she'd still catch herself smiling at string lights, at ferry schedules, at any boat that looked a little too eager to leave the dock \u2014 proof that some nights don't need a sequel to matter, they just need to have happened at all.",
        isEnding: true,
        choices: [],
      },
      36: {
        id: 36,
        content: "They walked the rest of the gravel road slowly, in no hurry now that the chasing part was over, trading the cardigan back and forth against the night air until neither of them remembered whose turn it was to wear it. By the time they reached the main road, they'd exchanged numbers, plans, and \u2014 quietly, almost as an afterthought \u2014 the beginning of something neither of them was willing to call small anymore.",
        isEnding: true,
        choices: [],
      },
      37: {
        id: 37,
        content: "She let him walk beside her the rest of the way, teasing him mercilessly for the cardigan excuse the entire time, but she noticed he didn't try very hard to keep up a witty defense \u2014 mostly he just seemed glad to be there. At the end of the road, she took the cardigan back, and gave him her number in trade, an even swap that felt, somehow, like the better end of the deal.",
        isEnding: true,
        choices: [],
      },
      38: {
        id: 38,
        content: "It took his sister three months and a fair amount of gentle nagging from Dane to track down the name on the wedding guest list who'd left a coat and a note and no forwarding address. When he finally found her \u2014 through a mutual friend of a friend, ridiculous and roundabout the way these things always are \u2014 his first words were, \"You're a very hard woman to thank properly.\" \"You found a way,\" she said, and let him.",
        isEnding: true,
        choices: [],
      },
      39: {
        id: 39,
        content: "He kept the note in the drawer of his nightstand for years, the paper gone soft at the folds the way things do when you handle them more than you'd admit to anyone. He never did track her down, and some nights he wondered if he should have. But there are people who pass through a story and leave it better anyway, without sticking around to watch what grows from it \u2014 and he came, eventually, to be at peace with having been part of one of those.",
        isEnding: true,
        choices: [],
      },
      40: {
        id: 40,
        content: "The coffee shop closed around them at nine and they hadn't noticed, still deep in a conversation that had wandered from the wedding to childhoods to everything in between. \"I should let you go,\" he said finally, not moving to leave. \"You really shouldn't,\" she said, and that was, as far as either of them could later reconstruct it, the exact moment the whole thing stopped being a maybe.",
        isEnding: true,
        choices: [],
      },
      41: {
        id: 41,
        content: "It was a genuinely lovely afternoon, full of easy laughter and comfortable silences, and by the time the check came they both understood, without either of them saying it outright, that this was the shape the story wanted to take \u2014 not a romance, but a friendship worth just as much, forged over burnt espresso and a boat ride neither of them would ever quite explain to anyone else properly.",
        isEnding: true,
        choices: [],
      },
      42: {
        id: 42,
        content: "\"This is going to sound ridiculous,\" Dane finally said, mid-call, after another long pause neither of them had rushed to fill, \"but I think we're better in person than on the phone.\" \"Wildly ridiculous,\" Mara agreed. \"Should we test the theory?\" They did. It turned out to be true \u2014 some people just need a dock, or a coffee shop, or anywhere that isn't a phone line, to finally stop being awkward and start being real.",
        isEnding: true,
        choices: [],
      },
      43: {
        id: 43,
        content: "The calls got shorter, then further apart, then stopped altogether sometime around the two-month mark, without either of them ever quite deciding to end it \u2014 it simply ran its course the way some things do, gently, with no hard feelings on either end. Mara still thought of the ferry sometimes, fondly, the way you think of a good story that simply found its natural stopping point.",
        isEnding: true,
        choices: [],
      },
      44: {
        id: 44,
        content: "\"I wondered if you'd lost this,\" he said, and she could hear him smiling through the phone. \"Three weeks,\" she admitted. \"I know exactly how many.\" \"Me too,\" he said, and something about the honesty of that \u2014 no games, no playing it cool \u2014 was exactly what convinced her she'd been right to finally dial. They talked for two hours that night, and neither of them was counting the ferry schedule anymore.",
        isEnding: true,
        choices: [],
      },
      45: {
        id: 45,
        content: "\"I wondered if I'd hear from you,\" he said, kind but careful, and something in his tone told her three weeks had been longer for him than it had felt for her. He was seeing someone now, he admitted, gently. Mara felt the loss of it more than she expected to \u2014 but she also felt something like relief, that she'd finally called, that the wondering was over, even if the answer wasn't the one she'd hoped for.",
        isEnding: true,
        choices: [],
      },
      46: {
        id: 46,
        content: "Eight months later, waiting for a delayed flight in an airport three states from either of their homes, Mara looked up from her book and found Dane three seats down, staring at her like he'd seen a ghost. \"You lost my number,\" he said, disbelieving. \"The universe apparently didn't agree with that decision,\" she said, and moved her bag to the empty seat beside her.",
        isEnding: true,
        choices: [],
      },
      47: {
        id: 47,
        content: "She never saw him again, and in time she made her peace with that \u2014 not everyone you meet is meant to stay, and some stories are complete exactly as short as they were. She kept the memory of that storm and that dock the way you keep a good photograph: not because it needs a sequel, but because it was, on its own, enough.",
        isEnding: true,
        choices: [],
      },
      48: {
        id: 48,
        content: "The historic designation went through, the boathouse stayed exactly where it had always been, and somewhere between permit applications and city council meetings, Mara and Dane had become something neither of them had filed the correct paperwork for but both were fairly sure was permanent. They repainted the boathouse door together the following spring. Neither of them ever explained to the town why it took two people who'd met on a stranded ferry three tries to agree on the shade of blue.",
        isEnding: true,
        choices: [],
      },
      49: {
        id: 49,
        content: "They won, technically \u2014 the board sided with them, the boathouse got its designation \u2014 but three exhausting months of hearings and paperwork had worn something thin between them that neither wanted to name aloud. They stayed close, grateful, forever tied together by having fought for something and won it. But the romance of it, they both quietly understood, had mostly burned off somewhere around hearing number four.",
        isEnding: true,
        choices: [],
      },
      50: {
        id: 50,
        content: "They stood together at the empty lot where the boathouse used to be, and instead of grief, Dane found something steadier settling into its place \u2014 Mara's hand finding his without either of them deciding to reach first. \"It's just wood and water,\" he said finally. \"The important part floated away with us already.\" They built something new together after that, in a different harbor, on a boat they picked out on purpose this time.",
        isEnding: true,
        choices: [],
      },
      51: {
        id: 51,
        content: "The fight had been worth having even in losing it, and when it ended, so \u2014 quietly, mutually, without any drama \u2014 did whatever had been building between them. \"I'm glad it was you I lost this with,\" Dane said at the airport, and meant it entirely. They stayed in touch for years afterward, two people who'd tried something good together and walked away from it clean.",
        isEnding: true,
        choices: [],
      },
      52: {
        id: 52,
        content: "The check-in call turned into a two-hour conversation, which turned into a visit the following weekend, which turned, eventually, into the kind of relationship that people who'd only met once on a stranded ferry had no real business expecting to work \u2014 and yet. \"You left your number in my jacket pocket,\" he told her, months later. \"Best risk I ever took with a piece of paper.\"",
        isEnding: true,
        choices: [],
      },
      53: {
        id: 53,
        content: "\"I'm not ready for more than this yet,\" Dane admitted, honest in a way that Mara respected more than she let on. \"But I'm really glad you called.\" They stayed close after that \u2014 genuinely, easily close, the kind of friendship that doesn't need an explanation for how it started, even when the explanation involves a missed ferry and a stolen boat.",
        isEnding: true,
        choices: [],
      },
      54: {
        id: 54,
        content: "\"Sorry it took so long,\" Dane said, when she finally picked up. \"I needed to actually be ready before I called, not just miss you enough to.\" It had been worth the wait, Mara decided, listening to him explain himself with more care than most people bothered with at all. Some things arrive exactly when they're supposed to, even when the waiting feels endless in the meantime.",
        isEnding: true,
        choices: [],
      },
      55: {
        id: 55,
        content: "He never called, and Mara let it go the way you let go of something you never really owned to begin with \u2014 gently, without bitterness, grateful for the strange, brief overlap their lives had made on a rainy dock one night. Some stories don't need a second chapter to have mattered. That one, she decided, had mattered plenty on its own.",
        isEnding: true,
        choices: [],
      },
      56: {
        id: 56,
        content: "\"You actually came,\" he said, and this time it wasn't a question at all \u2014 it was the start of a sentence that kept going, week after week, dock after dock, until neither of them needed the ferry schedule as an excuse anymore. What started as one missed boat became, over the better part of a year, the steadiest thing in either of their lives.",
        isEnding: true,
        choices: [],
      },
      57: {
        id: 57,
        content: "They never quite called it dating, and they never quite called it anything else either \u2014 just a standing Friday tradition, dock and boat and conversation, exactly as much as either of them wanted and not one thing more. It worked, for years, better than either of them expected something so undefined to work. Some love stories don't need a label to be one.",
        isEnding: true,
        choices: [],
      },
      58: {
        id: 58,
        content: "\"We're both terrible at listening to ourselves,\" Mara said, still catching her breath from the run to make it in time. \"Maybe we should start listening to each other instead.\" It turned out to be good advice. The near-miss became the thing they told people, years later, as the moment they finally stopped almost-showing-up for each other and started actually doing it.",
        isEnding: true,
        choices: [],
      },
      59: {
        id: 59,
        content: "She'd already left by the time he made it, soaked and ten minutes too late \u2014 but this time, she'd left a note tucked under a rock on the dock: *Next Friday. Try being on time.* He laughed out loud, alone, in the rain, and was there the following week a full twenty minutes early, just to be safe.",
        isEnding: true,
        choices: [],
      },
      60: {
        id: 60,
        content: "The message reached him, garbled slightly through two rounds of secondhand telling, but the important part survived intact: *Friday. Same dock.* He was there an hour early, just in case the message had gotten the time wrong too. It hadn't. She showed up exactly when she'd promised, and neither of them missed a Friday again for a long time after that.",
        isEnding: true,
        choices: [],
      },
      61: {
        id: 61,
        content: "The message got tangled somewhere between his sister and a mutual friend and never quite specified which Friday, so Dane showed up to the dock three weeks running, just in case. On the third week, Mara finally arrived too, breathless and apologetic, and found him already there, having decided that hope was worth a few wasted trips if there was any chance at all it might pay off.",
        isEnding: true,
        choices: [],
      },
      62: {
        id: 62,
        content: "She saw him from across a crowded ferry terminal, two years and a hundred miles from that first storm, and for a moment neither of them moved, like the universe was giving them a second to make sure it was real. \"You still catch late ferries?\" he called out, grinning, and Mara felt the whole strange story click back into place, exactly where it had left off.",
        isEnding: true,
        choices: [],
      },
      63: {
        id: 63,
        content: "Their paths never crossed again, not in any dramatic airport reunion, not in any chance encounter \u2014 just two lives that had touched briefly during one storm and then quietly, permanently, diverged. Mara thought of him sometimes, on rainy nights especially, and never quite stopped being glad, in a wistful sort of way, that she'd once said yes to a stranger's boat.",
        isEnding: true,
        choices: [],
      },
    },
  },
};