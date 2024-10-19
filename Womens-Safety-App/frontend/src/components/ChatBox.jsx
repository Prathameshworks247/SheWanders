// import React, { useEffect, useState } from "react"
// import { StreamChat } from 'stream-chat';
// import {
//   Chat,
//   Channel,
//   ChannelList,
//   Window,
//   ChannelHeader,
//   MessageList,
//   MessageInput,
//   Thread,
//   useCreateChatClient,
//   LoadingChannels,
//   LoadingIndicator,
// } from 'stream-chat-react';
// import 'stream-chat-react/dist/css/v2/index.css';

// const apiKey="8fpqsebfxgmt"

// function ChatBox({chatDetails,currentUser}) {
//   const [client,setClient]=useState(null);
//   const [channel,setChannel]=useState(null);

//     //sender and receiever - 
//     //{
//     //  name
//     //  _id
//     //  email
//     //}

//     const user={
//         id:currentUser,
//         name:chatDetails.sender._id===currentUser?chatDetails.sender.name:chatDetails.receiver.username,
//         email:chatDetails.sender._id===currentUser?chatDetails.sender.email:chatDetails.receiver.email
//     };

//     const senderUser={
//         id:chatDetails.sender._id,
//         name:chatDetails.sender.name,
//         email:chatDetails.sender.email
//     };
    
//       const receiverUser={
//         id:chatDetails.receiver._id,
//         name:chatDetails.receiver.username,
//         email:chatDetails.receiver.email
//       };
  
// //   const filters={
// //     type:'messaging',
// //     members:{$in:[user.id]}
// //   }
  
// //   const sort={
// //     last_message_at:-1
// //   }

//   useEffect(()=>{
//     async function init(){
//       const chatClient=StreamChat.getInstance(apiKey);

//         await chatClient.upsertUsers([senderUser, receiverUser]);
//         await chatClient.connectUser(user,chatClient.devToken(user.id));

//       const channel=chatClient.channel('messaging',chatDetails._id.toString(),{
//         members:[chatDetails.sender._id,chatDetails.receiver._id],
//         name:'Chat'
//       });

//       await channel.watch();

//       setChannel(channel);
//       setClient(chatClient);
//     }

//     init();

//     return ()=>{
//         if(client){
//           client.disconnectUser();
//         }
//     };
//   },[chatDetails,client]);

//   if(!client || !channel){
//     return <LoadingIndicator/>
//   }

//   return <Chat client={client} theme="messaging light">
//     {/* <ChannelList filters={filters} sort={sort}/> */}
//     <Channel channel={channel}>
//       <Window>
//         <ChannelHeader/>
//         <MessageList/>
//         <MessageInput/>
//       </Window>
//       <Thread/>
//     </Channel>
//   </Chat>
// }

// export default ChatBox;

// import { useEffect, useState } from "react"
// import { StreamChat } from 'stream-chat';
// import {
//   Chat,
//   Channel,
//   Window,
//   ChannelHeader,
//   MessageList,
//   MessageInput,
//   Thread,
//   LoadingIndicator,
// } from 'stream-chat-react';
// import 'stream-chat-react/dist/css/v2/index.css';

// const apiKey = "8fpqsebfxgmt"

// function ChatBox({ chatDetails, currentUser }) {
//   const [client, setClient] = useState(null);
//   const [channel, setChannel] = useState(null);

//   const user = {
//     id: currentUser,
//     name: chatDetails.sender._id === currentUser ? chatDetails.sender.username : chatDetails.receiver.username,
//     email: chatDetails.sender._id === currentUser ? chatDetails.sender.email : chatDetails.receiver.email
//   };

//   const senderUser = {
//     id: chatDetails.sender._id,
//     name: chatDetails.sender.username,
//     email: chatDetails.sender.email
//   };

//   const receiverUser = {
//     id: chatDetails.receiver._id,
//     name: chatDetails.receiver.username,
//     email: chatDetails.receiver.email
//   };

//   useEffect(() => {
//     let chatClient;

//     async function init() {
//       try {
//         chatClient = StreamChat.getInstance(apiKey);

//         if (!chatClient.userID) {
//           await chatClient.upsertUsers([senderUser, receiverUser]);
          
//           const userToken = chatClient.devToken(user.id);
//           await chatClient.connectUser(user, userToken);
//         }

//         const channel = chatClient.channel('messaging', chatDetails._id.toString(), {
//           members: [chatDetails.sender._id, chatDetails.receiver._id],
//           name: 'Chat'
//         });

//         await channel.watch();

//         setChannel(channel);
//         setClient(chatClient);
//       } catch (error) {
//         console.error("Error initializing chat:", error);
//       }
//     }

//     init();

//     return () => {
//       if (chatClient) {
//         const clientToDisconnect = chatClient;
//         setTimeout(() => {
//           clientToDisconnect.disconnectUser();
//         }, 0);
//       }
//     };
//   }, [chatDetails._id, currentUser]); // Remove client from dependencies

//   if (!client || !channel) {
//     return <LoadingIndicator />
//   }

//   return (
//     <Chat client={client} theme="messaging light">
//       <Channel channel={channel}>
//         <Window>
//           <ChannelHeader />
//           <MessageList />
//           <MessageInput />
//         </Window>
//         <Thread />
//       </Channel>
//     </Chat>
//   );
// }

// export default ChatBox;


import { useEffect, useState, useCallback } from "react"
import { StreamChat } from 'stream-chat';
import {
  Chat,
  Channel,
  Window,
  ChannelHeader,
  MessageList,
  MessageInput,
  Thread,
  LoadingIndicator,
} from 'stream-chat-react';
import 'stream-chat-react/dist/css/v2/index.css';

const apiKey = "8fpqsebfxgmt"

function ChatBox({ chatDetails, currentUser }) {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [error, setError] = useState(null);

  const user = {
    id: currentUser,
    name: chatDetails.sender._id === currentUser ? chatDetails.sender.name : chatDetails.receiver.username,
    email: chatDetails.sender._id === currentUser ? chatDetails.sender.email : chatDetails.receiver.email
  };

  const senderUser = {
    id: chatDetails.sender._id,
    name: chatDetails.sender.name,
    email: chatDetails.sender.email
  };

  const receiverUser = {
    id: chatDetails.receiver._id,
    name: chatDetails.receiver.username,
    email: chatDetails.receiver.email
  };

  const initializeChat = useCallback(async () => {
    try {
      console.log('Initializing chat...');
      
      // Create new instance
      const chatClient = new StreamChat(apiKey);
      console.log('Chat client created');

      // Check if user is already connected
      if (chatClient.userID) {
        console.log('User already connected:', chatClient.userID);
        await chatClient.disconnectUser();
      }

      // Generate token
      const userToken = chatClient.devToken(user.id);
      console.log('Token generated for user:', user.id);

      // Connect user
      await chatClient.connectUser(user, userToken);
      console.log('User connected successfully');

      // Upsert users
      await chatClient.upsertUsers([senderUser, receiverUser]);
      console.log('Users upserted');

      // Create and watch channel
      const newChannel = chatClient.channel('messaging', chatDetails._id.toString(), {
        members: [chatDetails.sender._id, chatDetails.receiver._id],
        name: 'Chat'
      });

      await newChannel.watch();
      console.log('Channel created and watched');

      setChannel(newChannel);
      setClient(chatClient);
      setError(null);
    } catch (err) {
      console.error('Chat initialization error:', err);
      setError(err.message);
      
      // Attempt cleanup if there was an error
      try {
        if (client) {
          await client.disconnectUser();
        }
      } catch (cleanupErr) {
        console.error('Cleanup error:', cleanupErr);
      }
    }
  }, [chatDetails._id, currentUser]);

  useEffect(() => {
    initializeChat();

    return () => {
      const cleanup = async () => {
        try {
          if (client) {
            console.log('Disconnecting user...');
            await client.disconnectUser();
            console.log('User disconnected successfully');
          }
        } catch (err) {
          console.error('Cleanup error:', err);
        }
      };
      cleanup();
    };
  }, [initializeChat]);

  if (error) {
    return (
      <div className="p-4 text-red-500">
        Error initializing chat: {error}
        <button 
          onClick={initializeChat}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!client || !channel) {
    return <LoadingIndicator />;
  }

  return (
    <Chat client={client} theme="messaging light">
      <Channel channel={channel}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </Channel>
    </Chat>
  );
}

export default ChatBox;