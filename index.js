const { App } = require('@slack/bolt');
const cron = require('node-cron');

// Initialize Slack app with Railway-optimized settings
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  port: process.env.PORT || 3000
});

// All tips from The Pragmatic Programmer
const PRAGMATIC_TIPS = [
  {
    number: 1,
    title: "Care About Your Craft",
    summary: "Software development is a craft. Without passion and interest in the quality of your work, you will never become a good developer."
  },
  {
    number: 2,
    title: "Think! About Your Work",
    summary: "Don't work on autopilot. Think continuously about what you're doing, how you're doing it, and why you're doing it."
  },
  {
    number: 3,
    title: "You Have Agency",
    summary: "You have control over your career and your decisions. Take responsibility for your professional growth and your projects."
  },
  {
    number: 4,
    title: "Provide Options, Don't Make Lame Excuses",
    summary: "Instead of making excuses, present solution options. Show ways how problems can be solved."
  },
  {
    number: 5,
    title: "Don't Live with Broken Windows",
    summary: "Bad code spreads like broken windows in abandoned buildings. Fix problems immediately before they spread."
  },
  {
    number: 6,
    title: "Be a Catalyst for Change",
    summary: "Large changes are often difficult to implement. Start with small, manageable improvements and build on them."
  },
  {
    number: 7,
    title: "Remember the Big Picture",
    summary: "Never lose sight of the big picture. Watch for creeping degradation in your project."
  },
  {
    number: 8,
    title: "Make Quality a Requirements Issue",
    summary: "Quality is not an add-on, but a requirement. Define quality standards explicitly with your stakeholders."
  },
  {
    number: 9,
    title: "Invest Regularly in Your Knowledge Portfolio",
    summary: "Treat your knowledge like an investment portfolio. Continuously learn new technologies and concepts."
  },
  {
    number: 10,
    title: "Critically Analyze What You Read and Hear",
    summary: "Question everything critically. Not everything you read or hear is correct or applicable to your situation."
  },
  {
    number: 11,
    title: "English is Just Another Programming Language",
    summary: "Communication is just as important as programming. Invest in your writing and communication skills."
  },
  {
    number: 12,
    title: "It's Both What You Say and the Way You Say It",
    summary: "Not only the content matters, but also the way of presentation. Know your audience and adapt your communication accordingly."
  },
  {
    number: 13,
    title: "Build Documentation In, Don't Bolt It On",
    summary: "Documentation should be considered from the beginning, not added afterwards. Integrate it into your development process."
  },
  {
    number: 14,
    title: "Good Design Is Easier to Change Than Bad Design",
    summary: "Flexibility and adaptability are signs of good design. Code should be easy to change (ETC - Easier to Change)."
  },
  {
    number: 15,
    title: "DRY - Don't Repeat Yourself",
    summary: "Every piece of knowledge should exist only once in the system. Repetition leads to inconsistencies and maintenance problems."
  },
  {
    number: 16,
    title: "Make It Easy to Reuse",
    summary: "Design modules and components so they can be easily reused. Promote reuse through good interfaces."
  },
  {
    number: 17,
    title: "Eliminate Effects Between Unrelated Things",
    summary: "Orthogonality means that changes in one area have no unexpected effects on other areas."
  },
  {
    number: 18,
    title: "There Are No Final Decisions",
    summary: "Keep your architecture flexible. Decisions made today may be obsolete tomorrow."
  },
  {
    number: 19,
    title: "Forgo Following Fads",
    summary: "Don't follow every trend. Choose technologies based on their merits for your specific problem."
  },
  {
    number: 20,
    title: "Use Tracer Bullets to Find the Target",
    summary: "Implement a thin slice through the entire system early to identify risks and get feedback."
  },
  {
    number: 21,
    title: "Prototype to Learn",
    summary: "Create prototypes to understand unclear requirements and evaluate technical risks."
  },
  {
    number: 22,
    title: "Program Close to the Problem Domain",
    summary: "Use domain-specific languages and abstractions that correspond to the problem domain."
  },
  {
    number: 23,
    title: "Estimate to Avoid Surprises",
    summary: "Learn to estimate and communicate the uncertainty of your estimates clearly."
  },
  {
    number: 24,
    title: "Use Configuration to Make Your Code More Flexible",
    summary: "Extract changeable values into configuration files to increase flexibility."
  },
  {
    number: 25,
    title: "Put Abstractions in Code, Details in Metadata",
    summary: "Keep general concepts in code and specific details in metadata or configurations."
  },
  {
    number: 26,
    title: "Analyze Workflow to Improve Concurrency",
    summary: "Understand workflows to identify opportunities for parallel processing."
  },
  {
    number: 27,
    title: "Design Using Services",
    summary: "Think in terms of services rather than objects. Services are independent, well-defined units."
  },
  {
    number: 28,
    title: "Always Design for Concurrency",
    summary: "Even if you don't need parallelism today, design so it can be added later."
  },
  {
    number: 29,
    title: "Shared State Is Incorrect State",
    summary: "Shared state leads to race conditions and hard-to-trace errors."
  },
  {
    number: 30,
    title: "Random Failures Are Often Concurrency Issues",
    summary: "Sporadic, hard-to-reproduce errors are often due to concurrency problems."
  },
  {
    number: 31,
    title: "Use Actors for Concurrency Without Shared State",
    summary: "The Actor model provides an elegant solution for concurrency without shared state."
  },
  {
    number: 32,
    title: "Listen to Your Lizard Brain",
    summary: "Trust your intuition. If something doesn't feel right, something probably isn't right."
  },
  {
    number: 33,
    title: "Programming Is About Code, But Programs Are About Data",
    summary: "Understand your data structures. Often the design of data is more important than the code."
  },
  {
    number: 34,
    title: "Don't Gather Requirements – Dig for Them",
    summary: "Requirements are often not obvious. Ask the right questions to understand the true needs."
  },
  {
    number: 35,
    title: "Work with a User to Think Like a User",
    summary: "Work closely with end users to understand their perspective."
  },
  {
    number: 36,
    title: "Abstractions Live Longer than Details",
    summary: "Invest in good abstractions. They survive longer than specific implementation details."
  },
  {
    number: 37,
    title: "Use a Project Glossary",
    summary: "Define terms clearly and use them consistently across the entire team."
  },
  {
    number: 38,
    title: "Don't Think Outside the Box – Find the Box",
    summary: "Understand the constraints and boundaries of your problem before developing solutions."
  },
  {
    number: 39,
    title: "Start When You're Ready",
    summary: "Only begin implementation when you truly understand the problem."
  },
  {
    number: 40,
    title: "Some Things Are Better Done than Described",
    summary: "Sometimes it's more efficient to create a prototype than to write a detailed specification."
  },
  {
    number: 41,
    title: "Don't Be a Slave to Formal Methods",
    summary: "Formal methods are tools, not an end in themselves. Use them when they are helpful."
  },
  {
    number: 42,
    title: "Expensive Tools Don't Produce Better Designs",
    summary: "Good designs come from thinking, not from expensive software."
  },
  {
    number: 43,
    title: "Organize Teams Around Functionality",
    summary: "Structure teams by functionality, not by technology or role."
  },
  {
    number: 44,
    title: "Don't Use Manual Procedures",
    summary: "Automate repeatable processes. Manual steps are error-prone."
  },
  {
    number: 45,
    title: "Test Early, Test Often, Test Automatically",
    summary: "Tests are your safety net. The earlier and more frequently you test, the better."
  },
  {
    number: 46,
    title: "Coding Ain't Done 'Til All the Tests Run",
    summary: "Code is only finished when all tests run successfully."
  },
  {
    number: 47,
    title: "Use Saboteurs to Test Your Testing",
    summary: "Deliberately introduce errors to test whether your tests detect them."
  },
  {
    number: 48,
    title: "Test State Coverage, Not Code Coverage",
    summary: "More important than code coverage is whether all possible states are tested."
  },
  {
    number: 49,
    title: "Find Bugs Once",
    summary: "When you find a bug, write a test that reproduces it before fixing it."
  },
  {
    number: 50,
    title: "Don't Use Wizard Code You Don't Understand",
    summary: "Only use code you understand. Generated code can cause unexpected problems."
  },
  {
    number: 51,
    title: "Don't Panic",
    summary: "Stay calm when problems arise. Panic leads to poor decisions."
  },
  {
    number: 52,
    title: "Finish What You Start",
    summary: "Bring projects to completion. Unfinished work has no value."
  },
  {
    number: 53,
    title: "Sign Your Work",
    summary: "Stand behind your code. Quality comes from pride in your own work."
  }
];

// Configuration
const CHANNEL_ID = process.env.SLACK_CHANNEL_ID || '#general';
const DAILY_TIME = process.env.DAILY_TIME || '09:00';
const TIMEZONE = process.env.TIMEZONE || 'Europe/Berlin';

// In-memory storage for used tips (Railway provides ephemeral storage)
// For production, consider using Railway's PostgreSQL addon for persistence
let usedTips = new Set();

class TipManager {
  getRandomUnusedTip() {
    // If all tips have been used, reset the cycle
    if (usedTips.size >= PRAGMATIC_TIPS.length) {
      usedTips.clear();
      console.log('🔄 All tips used, resetting cycle');
    }

    // Get available tips
    const availableTips = PRAGMATIC_TIPS.filter(tip => !usedTips.has(tip.number));
    
    // Select random tip
    const randomIndex = Math.floor(Math.random() * availableTips.length);
    const selectedTip = availableTips[randomIndex];

    // Mark as used
    usedTips.add(selectedTip.number);

    return selectedTip;
  }

  formatTipMessage(tip) {
    const emojis = ['💡', '🚀', '⚡', '🎯', '🔧', '📚', '💪', '🧠'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    
    return {
      blocks: [
        {
          type: "header",
          text: {
            type: "plain_text",
            text: `${randomEmoji} Daily Pragmatic Tip #${tip.number}`,
            emoji: true
          }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${tip.title}*\n\n${tip.summary}`
          }
        },
        {
          type: "context",
          elements: [
            {
              type: "mrkdwn",
              text: "📖 From _The Pragmatic Programmer_ by Andrew Hunt & David Thomas"
            }
          ]
        },
        {
          type: "divider"
        }
      ]
    };
  }
}

const tipManager = new TipManager();

// Function to post daily tip
async function postDailyTip() {
  try {
    const tip = tipManager.getRandomUnusedTip();
    const message = tipManager.formatTipMessage(tip);

    await app.client.chat.postMessage({
      channel: CHANNEL_ID,
      ...message
    });

    console.log(`✅ Posted tip #${tip.number}: ${tip.title}`);
  } catch (error) {
    console.error('❌ Error posting daily tip:', error);
  }
}

// Slash command to get a tip on demand
app.command('/pragmatic-tip', async ({ command, ack, respond }) => {
  await ack();

  try {
    const tip = tipManager.getRandomUnusedTip();
    const message = tipManager.formatTipMessage(tip);

    await respond({
      ...message,
      response_type: 'in_channel'
    });
  } catch (error) {
    console.error('Error responding to slash command:', error);
    await respond({
      text: 'Sorry, there was an error getting your pragmatic tip! 😞',
      response_type: 'ephemeral'
    });
  }
});

// Slash command to reset the tip cycle
app.command('/reset-tips', async ({ command, ack, respond }) => {
  await ack();

  try {
    usedTips.clear();

    await respond({
      text: '🔄 Tip cycle has been reset! All tips are now available again.',
      response_type: 'ephemeral'
    });
  } catch (error) {
    console.error('Error resetting tips:', error);
    await respond({
      text: 'Sorry, there was an error resetting the tips! 😞',
      response_type: 'ephemeral'
    });
  }
});

// Slash command to check tip status
app.command('/tip-status', async ({ command, ack, respond }) => {
  await ack();

  try {
    const usedCount = usedTips.size;
    const totalCount = PRAGMATIC_TIPS.length;
    const remainingCount = totalCount - usedCount;

    await respond({
      text: `📊 *Tip Status*\n• Used tips: ${usedCount}/${totalCount}\n• Remaining tips: ${remainingCount}\n• Progress: ${Math.round((usedCount / totalCount) * 100)}%`,
      response_type: 'ephemeral'
    });
  } catch (error) {
    console.error('Error getting tip status:', error);
    await respond({
      text: 'Sorry, there was an error getting the tip status! 😞',
      response_type: 'ephemeral'
    });
  }
});

// Health check endpoint for Railway
app.receiver.router.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    uptime: process.uptime(),
    usedTips: usedTips.size,
    totalTips: PRAGMATIC_TIPS.length
  });
});

// Schedule daily tip posting
// Format: minute hour day month day-of-week
const [hour, minute] = DAILY_TIME.split(':');
cron.schedule(`${minute} ${hour} * * *`, () => {
  console.log('📅 Posting daily pragmatic tip...');
  postDailyTip();
}, {
  timezone: TIMEZONE
});

// Start the app
(async () => {
  try {
    await app.start();
    console.log('⚡️ Pragmatic Programmer Slack Bot is running on Railway!');
    console.log(`📅 Daily tips scheduled for ${DAILY_TIME} (${TIMEZONE} timezone)`);
    console.log(`📢 Posting to channel: ${CHANNEL_ID}`);
    console.log(`🏥 Health check available at /health`);
    console.log('Available commands:');
    console.log('  /pragmatic-tip - Get a random tip');
    console.log('  /reset-tips - Reset the tip cycle');
    console.log('  /tip-status - Check tip progress');
  } catch (error) {
    console.error('❌ Error starting app:', error);
    process.exit(1);
  }
})();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('👋 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('👋 Shutting down gracefully...');
  process.exit(0);
});