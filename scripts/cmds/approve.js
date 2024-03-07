const fs = require("fs");
const approvedDataPath = "threadApproved.json"; // Path for approved data

module.exports = {
  config: {
    name: "approve",
    author: "Rômeo",
    countDown: 0,
    role: 2,
    category: "owner",
    shortDescription: {
      en: "",
    },
  },

  onLoad: async function () {
    if (!fs.existsSync(approvedDataPath)) {
      fs.writeFileSync(approvedDataPath, JSON.stringify([]));
    }
  },

  onStart: async function ({ event, api, args }) {
    const { threadID, messageID, senderID } = event;
    const command = args[0] || "";
    const idToApprove = args[1] || threadID;

    let approvedData = JSON.parse(fs.readFileSync(approvedDataPath));

    if (command === "list") {
      let msg = "𝗔𝗣𝗣𝗥𝗢𝗩𝗘𝗗 𝗚𝗖 𝗟𝗜𝗦𝗧\n\nHere Is Approved Groups List/Data\n";
      approvedData.forEach((e, index) => {
        msg += `${index + 1}. ✅ 𝗚𝗥𝗢𝗨𝗣 𝗨𝗜𝗗\n${e}\n`;
      });
      api.sendMessage(msg, threadID, messageID);
    } else if (command === "del") {
      if (!isNumeric(idToApprove)) {
        api.sendMessage("⛔ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗡𝗨𝗠𝗕𝗘𝗥 \n\n🙆 Invalid Number or Tid please check your group number ", threadID, messageID);
        return;
      }

      if (!approvedData.includes(idToApprove)) {
        api.sendMessage(
          "⛔ 𝗨𝗡𝗔𝗣𝗣𝗥𝗢𝗩𝗘𝗗 𝗚𝗖\n\n👍 The group was not approved before! ",
          threadID,
          messageID
        );
        return;
      }

      approvedData = approvedData.filter((e) => e !== idToApprove);
      fs.writeFileSync(approvedDataPath, JSON.stringify(approvedData, null, 2));

      api.sendMessage(
        `⛔ 𝗥𝗘𝗠𝗢𝗩𝗘𝗗 𝗔𝗣𝗣𝗥𝗢𝗩𝗘\n\n🙇 Group ${idToApprove} has been removed from the approval list `,
        threadID,
        messageID
      );
    } else if (!isNumeric(idToApprove)) {
      api.sendMessage("⛔ 𝗜𝗡𝗩𝗔𝗟𝗜𝗗 𝗧𝗛𝗥𝗘𝗔𝗗\n\n🙆 Invalid Group UID please check your group uid", threadID, messageID);
    } else if (approvedData.includes(idToApprove)) {
      api.sendMessage(
        `✅ 𝗔𝗟𝗥𝗘𝗔𝗗𝗬 𝗔𝗣𝗣𝗥𝗢𝗩𝗘𝗗\n\n🙆 Group ${idToApprove} was approved before! `,
        threadID,
        messageID
      );
    } else {
      // Approve the group
      approvedData.push(idToApprove);
      fs.writeFileSync(approvedDataPath, JSON.stringify(approvedData, null, 2));

      // Send approval message to the group
      const adminName = api.getUserInfo(senderID).name;
      const adminUID = event.senderID;
      const adminFbLink = `https://www.facebook.com/mdromeoislamrasel.5`;
      const approvalTime = new Date().toLocaleTimeString();
      const approvalDate = new Date().toLocaleDateString();
      const approvalCount = approvedData.length;
      const approvedList = approvedData.join("\n");

      const approvalMessage = `✅ 𝗔𝗽𝗽𝗿𝗼𝘃𝗮𝗹 𝗜𝗻𝗳𝗼𝗿𝗺𝗮𝘁𝗶𝗼𝗻\n\n✅ Your group has been approved by Admin \n🅰𝗔𝗱𝗺𝗶𝗻 𝗨𝗜𝗗: ${adminUID}\nℹ𝗔𝗱𝗺𝗶𝗻 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 𝗟𝗶𝗻𝗸: ${adminFbLink}\n⏲𝗔𝗽𝗽𝗿𝗼𝘃𝗮𝗹 𝗧𝗶𝗺𝗲: ${approvalTime}\n📅𝗔𝗽𝗽𝗿𝗼𝘃𝗮𝗹 𝗗𝗮𝘁𝗲: ${approvalDate}\n\n✅𝗧𝗼𝘁𝗮𝗹 𝗔𝗽𝗽𝗿𝗼𝘃𝗲𝗱 𝗚𝗿𝗼𝘂𝗽𝘀: ${approvalCount}`;

      api.sendMessage(approvalMessage, idToApprove);
      api.sendMessage(`✅ 𝗔𝗣𝗣𝗥𝗢𝗩𝗘𝗗 𝗗𝗢𝗡𝗘\n\n✅ Group approved successful: ${idToApprove}`, threadID, messageID);
    }
  },
};

function isNumeric(value) {
  return /^-?\d+$/.test(value);
}