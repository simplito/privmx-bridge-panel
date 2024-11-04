export type AclData = AclGroup[];

export interface AclGroup {
    id: string;
    functions: AclFunction[];
}

export interface AclFunction {
    id: string;
    parameters: string[];
}

// Use ./aclDataObtainer.js to obtain this data
export const aclData: AclData = [
    {
        id: "thread/READ",
        functions: [
            {
                id: "thread/threadGet",
                parameters: ["threadId"],
            },
            {
                id: "thread/threadList",
                parameters: [],
            },
            {
                id: "thread/threadMessageGet",
                parameters: ["threadId", "messageId"],
            },
            {
                id: "thread/threadMessagesGet",
                parameters: ["threadId"],
            },
        ],
    },
    {
        id: "thread/WRITE",
        functions: [
            {
                id: "thread/threadCreate",
                parameters: [],
            },
            {
                id: "thread/threadUpdate",
                parameters: ["threadId"],
            },
            {
                id: "thread/threadDelete",
                parameters: ["threadId"],
            },
            {
                id: "thread/threadDeleteMany",
                parameters: [],
            },
            {
                id: "thread/threadMessageSend",
                parameters: ["threadId"],
            },
            {
                id: "thread/threadMessageDelete",
                parameters: ["threadId", "messageId"],
            },
            {
                id: "thread/threadMessageDeleteMany",
                parameters: ["threadId"],
            },
            {
                id: "thread/threadMessageDeleteOlderThan",
                parameters: ["threadId"],
            },
        ],
    },
    {
        id: "thread/ALL",
        functions: [
            {
                id: "thread/threadGet",
                parameters: ["threadId"],
            },
            {
                id: "thread/threadList",
                parameters: [],
            },
            {
                id: "thread/threadMessageGet",
                parameters: ["threadId", "messageId"],
            },
            {
                id: "thread/threadMessagesGet",
                parameters: ["threadId"],
            },
            {
                id: "thread/threadCreate",
                parameters: [],
            },
            {
                id: "thread/threadUpdate",
                parameters: ["threadId"],
            },
            {
                id: "thread/threadDelete",
                parameters: ["threadId"],
            },
            {
                id: "thread/threadDeleteMany",
                parameters: [],
            },
            {
                id: "thread/threadMessageSend",
                parameters: ["threadId"],
            },
            {
                id: "thread/threadMessageDelete",
                parameters: ["threadId", "messageId"],
            },
            {
                id: "thread/threadMessageDeleteMany",
                parameters: ["threadId"],
            },
            {
                id: "thread/threadMessageDeleteOlderThan",
                parameters: ["threadId"],
            },
        ],
    },
    {
        id: "store/READ",
        functions: [
            {
                id: "store/storeGet",
                parameters: ["storeId"],
            },
            {
                id: "store/storeList",
                parameters: [],
            },
            {
                id: "store/storeFileGet",
                parameters: ["storeId", "fileId"],
            },
            {
                id: "store/storeFileList",
                parameters: ["storeId"],
            },
            {
                id: "store/storeFileRead",
                parameters: ["storeId", "fileId"],
            },
        ],
    },
    {
        id: "store/WRITE",
        functions: [
            {
                id: "store/storeCreate",
                parameters: [],
            },
            {
                id: "store/storeUpdate",
                parameters: ["storeId"],
            },
            {
                id: "store/storeDelete",
                parameters: ["storeId"],
            },
            {
                id: "store/storeDeleteMany",
                parameters: [],
            },
            {
                id: "store/storeFileCreate",
                parameters: ["storeId"],
            },
            {
                id: "store/storeFileWrite",
                parameters: ["storeId", "fileId"],
            },
            {
                id: "store/storeFileUpdate",
                parameters: ["storeId", "fileId"],
            },
            {
                id: "store/storeFileDelete",
                parameters: ["storeId", "fileId"],
            },
            {
                id: "store/storeFileDeleteMany",
                parameters: ["storeId"],
            },
            {
                id: "store/storeFileDeleteOlderThan",
                parameters: ["storeId"],
            },
        ],
    },
    {
        id: "store/ALL",
        functions: [
            {
                id: "store/storeGet",
                parameters: ["storeId"],
            },
            {
                id: "store/storeList",
                parameters: [],
            },
            {
                id: "store/storeFileGet",
                parameters: ["storeId", "fileId"],
            },
            {
                id: "store/storeFileList",
                parameters: ["storeId"],
            },
            {
                id: "store/storeFileRead",
                parameters: ["storeId", "fileId"],
            },
            {
                id: "store/storeCreate",
                parameters: [],
            },
            {
                id: "store/storeUpdate",
                parameters: ["storeId"],
            },
            {
                id: "store/storeDelete",
                parameters: ["storeId"],
            },
            {
                id: "store/storeDeleteMany",
                parameters: [],
            },
            {
                id: "store/storeFileCreate",
                parameters: ["storeId"],
            },
            {
                id: "store/storeFileWrite",
                parameters: ["storeId", "fileId"],
            },
            {
                id: "store/storeFileUpdate",
                parameters: ["storeId", "fileId"],
            },
            {
                id: "store/storeFileDelete",
                parameters: ["storeId", "fileId"],
            },
            {
                id: "store/storeFileDeleteMany",
                parameters: ["storeId"],
            },
            {
                id: "store/storeFileDeleteOlderThan",
                parameters: ["storeId"],
            },
        ],
    },
    {
        id: "inbox/READ",
        functions: [
            {
                id: "inbox/inboxGet",
                parameters: ["inboxId"],
            },
            {
                id: "inbox/inboxList",
                parameters: [],
            },
        ],
    },
    {
        id: "inbox/WRITE",
        functions: [
            {
                id: "inbox/inboxCreate",
                parameters: [],
            },
            {
                id: "inbox/inboxUpdate",
                parameters: ["inboxId"],
            },
            {
                id: "inbox/inboxDelete",
                parameters: ["inboxId"],
            },
            {
                id: "inbox/inboxDeleteMany",
                parameters: [],
            },
        ],
    },
    {
        id: "inbox/ALL",
        functions: [
            {
                id: "inbox/inboxGet",
                parameters: ["inboxId"],
            },
            {
                id: "inbox/inboxList",
                parameters: [],
            },
            {
                id: "inbox/inboxCreate",
                parameters: [],
            },
            {
                id: "inbox/inboxUpdate",
                parameters: ["inboxId"],
            },
            {
                id: "inbox/inboxDelete",
                parameters: ["inboxId"],
            },
            {
                id: "inbox/inboxDeleteMany",
                parameters: [],
            },
        ],
    },
    {
        id: "stream/READ",
        functions: [
            {
                id: "stream/streamRoomGet",
                parameters: ["streamRoomId"],
            },
            {
                id: "stream/streamRoomList",
                parameters: [],
            },
        ],
    },
    {
        id: "stream/WRITE",
        functions: [
            {
                id: "stream/streamRoomCreate",
                parameters: [],
            },
            {
                id: "stream/streamRoomUpdate",
                parameters: ["streamRoomId"],
            },
            {
                id: "stream/streamRoomDelete",
                parameters: ["streamRoomId"],
            },
            {
                id: "stream/streamRoomDeleteMany",
                parameters: [],
            },
        ],
    },
    {
        id: "stream/ALL",
        functions: [
            {
                id: "stream/streamRoomGet",
                parameters: ["streamRoomId"],
            },
            {
                id: "stream/streamRoomList",
                parameters: [],
            },
            {
                id: "stream/streamRoomCreate",
                parameters: [],
            },
            {
                id: "stream/streamRoomUpdate",
                parameters: ["streamRoomId"],
            },
            {
                id: "stream/streamRoomDelete",
                parameters: ["streamRoomId"],
            },
            {
                id: "stream/streamRoomDeleteMany",
                parameters: [],
            },
        ],
    },
    {
        id: "READ",
        functions: [
            {
                id: "store/storeGet",
                parameters: ["storeId"],
            },
            {
                id: "store/storeList",
                parameters: [],
            },
            {
                id: "store/storeFileGet",
                parameters: ["storeId", "fileId"],
            },
            {
                id: "store/storeFileList",
                parameters: ["storeId"],
            },
            {
                id: "store/storeFileRead",
                parameters: ["storeId", "fileId"],
            },
            {
                id: "thread/threadGet",
                parameters: ["threadId"],
            },
            {
                id: "thread/threadList",
                parameters: [],
            },
            {
                id: "thread/threadMessageGet",
                parameters: ["threadId", "messageId"],
            },
            {
                id: "thread/threadMessagesGet",
                parameters: ["threadId"],
            },
            {
                id: "inbox/inboxGet",
                parameters: ["inboxId"],
            },
            {
                id: "inbox/inboxList",
                parameters: [],
            },
            {
                id: "stream/streamRoomGet",
                parameters: ["streamRoomId"],
            },
            {
                id: "stream/streamRoomList",
                parameters: [],
            },
        ],
    },
    {
        id: "WRITE",
        functions: [
            {
                id: "store/storeCreate",
                parameters: [],
            },
            {
                id: "store/storeUpdate",
                parameters: ["storeId"],
            },
            {
                id: "store/storeDelete",
                parameters: ["storeId"],
            },
            {
                id: "store/storeDeleteMany",
                parameters: [],
            },
            {
                id: "store/storeFileCreate",
                parameters: ["storeId"],
            },
            {
                id: "store/storeFileWrite",
                parameters: ["storeId", "fileId"],
            },
            {
                id: "store/storeFileUpdate",
                parameters: ["storeId", "fileId"],
            },
            {
                id: "store/storeFileDelete",
                parameters: ["storeId", "fileId"],
            },
            {
                id: "store/storeFileDeleteMany",
                parameters: ["storeId"],
            },
            {
                id: "store/storeFileDeleteOlderThan",
                parameters: ["storeId"],
            },
            {
                id: "thread/threadGet",
                parameters: ["threadId"],
            },
            {
                id: "thread/threadList",
                parameters: [],
            },
            {
                id: "thread/threadMessageGet",
                parameters: ["threadId", "messageId"],
            },
            {
                id: "thread/threadMessagesGet",
                parameters: ["threadId"],
            },
            {
                id: "inbox/inboxGet",
                parameters: ["inboxId"],
            },
            {
                id: "inbox/inboxList",
                parameters: [],
            },
            {
                id: "stream/streamRoomGet",
                parameters: ["streamRoomId"],
            },
            {
                id: "stream/streamRoomList",
                parameters: [],
            },
        ],
    },
    {
        id: "ALL",
        functions: [
            {
                id: "store/storeGet",
                parameters: ["storeId"],
            },
            {
                id: "store/storeList",
                parameters: [],
            },
            {
                id: "store/storeFileGet",
                parameters: ["storeId", "fileId"],
            },
            {
                id: "store/storeFileList",
                parameters: ["storeId"],
            },
            {
                id: "store/storeFileRead",
                parameters: ["storeId", "fileId"],
            },
            {
                id: "store/storeCreate",
                parameters: [],
            },
            {
                id: "store/storeUpdate",
                parameters: ["storeId"],
            },
            {
                id: "store/storeDelete",
                parameters: ["storeId"],
            },
            {
                id: "store/storeDeleteMany",
                parameters: [],
            },
            {
                id: "store/storeFileCreate",
                parameters: ["storeId"],
            },
            {
                id: "store/storeFileWrite",
                parameters: ["storeId", "fileId"],
            },
            {
                id: "store/storeFileUpdate",
                parameters: ["storeId", "fileId"],
            },
            {
                id: "store/storeFileDelete",
                parameters: ["storeId", "fileId"],
            },
            {
                id: "store/storeFileDeleteMany",
                parameters: ["storeId"],
            },
            {
                id: "store/storeFileDeleteOlderThan",
                parameters: ["storeId"],
            },
            {
                id: "thread/threadGet",
                parameters: ["threadId"],
            },
            {
                id: "thread/threadList",
                parameters: [],
            },
            {
                id: "thread/threadMessageGet",
                parameters: ["threadId", "messageId"],
            },
            {
                id: "thread/threadMessagesGet",
                parameters: ["threadId"],
            },
            {
                id: "thread/threadCreate",
                parameters: [],
            },
            {
                id: "thread/threadUpdate",
                parameters: ["threadId"],
            },
            {
                id: "thread/threadDelete",
                parameters: ["threadId"],
            },
            {
                id: "thread/threadDeleteMany",
                parameters: [],
            },
            {
                id: "thread/threadMessageSend",
                parameters: ["threadId"],
            },
            {
                id: "thread/threadMessageDelete",
                parameters: ["threadId", "messageId"],
            },
            {
                id: "thread/threadMessageDeleteMany",
                parameters: ["threadId"],
            },
            {
                id: "thread/threadMessageDeleteOlderThan",
                parameters: ["threadId"],
            },
            {
                id: "inbox/inboxGet",
                parameters: ["inboxId"],
            },
            {
                id: "inbox/inboxList",
                parameters: [],
            },
            {
                id: "inbox/inboxCreate",
                parameters: [],
            },
            {
                id: "inbox/inboxUpdate",
                parameters: ["inboxId"],
            },
            {
                id: "inbox/inboxDelete",
                parameters: ["inboxId"],
            },
            {
                id: "inbox/inboxDeleteMany",
                parameters: [],
            },
            {
                id: "stream/streamRoomGet",
                parameters: ["streamRoomId"],
            },
            {
                id: "stream/streamRoomList",
                parameters: [],
            },
            {
                id: "stream/streamRoomCreate",
                parameters: [],
            },
            {
                id: "stream/streamRoomUpdate",
                parameters: ["streamRoomId"],
            },
            {
                id: "stream/streamRoomDelete",
                parameters: ["streamRoomId"],
            },
            {
                id: "stream/streamRoomDeleteMany",
                parameters: [],
            },
        ],
    },
];
