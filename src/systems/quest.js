// Quest System
export const questState = {
    activeQuest: null,
    completedQuests: [],
    stats: {
        bugsKilled: 0,
        errorsFixed: 0,
        keysFound: 0
    }
};

export const quests = [
    {
        id: "bug_hunt",
        title: "Debug the Forest",
        desc: "Eliminate 5 Bugs in the Project Forest.",
        isComplete: () => questState.stats.bugsKilled >= 5,
        reward: "Access Key"
    },
    {
        id: "fix_errors",
        title: "Server Restoration",
        desc: "Fix 3 Critical Errors near the Castle.",
        isComplete: () => questState.stats.errorsFixed >= 3,
        reward: "Admin Privileges"
    }
];

export function startQuest(questId) {
    const q = quests.find(x => x.id === questId);
    if (q) {
        questState.activeQuest = q;
        // Trigger UI update
    }
}

export function checkQuestProgress() {
    if (questState.activeQuest && questState.activeQuest.isComplete()) {
        questState.completedQuests.push(questState.activeQuest.id);
        const reward = questState.activeQuest.reward;
        questState.activeQuest = null;
        return reward;
    }
    return null;
}
