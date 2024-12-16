import { useBoolean } from 'usehooks-ts';
import ReactDOM from 'react-dom';
import { css } from '@emotion/react';
import { Button, CloseButton } from 'react-bootstrap';
import {
    MainContainer,
    ChatContainer,
    MessageList,
    MessageInput,
    ConversationHeader,
    Message,
} from '@chatscope/chat-ui-kit-react';
import useTicketStore from '@/stores/message-store';
import { getMessages, useGetTicket } from '@/services/api';
import { useUserProfile } from '@/stores/user-store';
import { useInfiniteQuery } from '@tanstack/react-query';
import React from 'react';
import { MessageDTO } from '@/types';
import useSignalRStore from '@/stores/signalRStore';
export default function Chat() {
    return ReactDOM.createPortal(<Root />, document.getElementById('root')!);
}

function Root() {
    const { toggle, value } = useBoolean(false);
    const { currentTicket, setCurrentTicket } = useTicketStore();
    const currentUser = useUserProfile();
    const [messageKey, setMessageKey] = React.useState(0);
    const signalRStore = useSignalRStore();
    const isPatient = !!currentUser?.patient;
    const { data: ticket, error } = useGetTicket(currentTicket?.ticketId!, {
        query: {
            enabled: !!currentTicket?.ticketId,
            select: (data) => data.data,
        },
    });
    React.useEffect(() => {
        if (error) {
            if (error.status == 404) {
                setCurrentTicket(undefined);
            }
        }
    }, [error]);
    React.useEffect(() => {
        if (ticket && ticket.isClosed) {
            setCurrentTicket(undefined);
        }
    }, [ticket]);
    React.useEffect(() => {
        console.log('register event', signalRStore.connection);
        const handleNewMessage = (data: any) => {
            console.log(data);
            setMessageKey((prev) => prev + 1);
        };

        signalRStore.connection?.on('NewMessage', handleNewMessage);
        return () => {
            signalRStore.connection?.off('NewMessage', handleNewMessage);
        };
    }, [signalRStore.connection]);

    const {
        data: messages,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
    } = useInfiniteQuery({
        queryKey: ['messages', currentTicket?.ticketId!, messageKey],
        queryFn: async ({ pageParam }) => {
            const rest = await getMessages(currentTicket?.ticketId!, { PageSize: 10, Page: pageParam });
            return {
                nextCursor: pageParam + 1,
                pages: rest.data.data,
            };
        },
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
        initialData: {
            pageParams: [1],
            pages: [],
        },
        initialPageParam: 1,
        enabled: !!currentTicket?.ticketId,
        select: (data) => ({
            pageParams: [...data.pageParams],
            pages: [...data.pages],
        }),
    });
    const orderedMessages = React.useMemo(() => {
        return messages?.pages
            .reduce((acc, page) => {
                return [...acc, ...page.pages];
            }, [])
            .reverse() as MessageDTO[];
    }, [messages.pages.length]);

    const handleOpenTicket = async (initMessage?: string) => {
        signalRStore.connection
            ?.invoke('OpenTicket', currentUser?.patient?.patientId, initMessage)
            .catch((err) => {
                console.log(err);
            })
            .then((data) => {
                setCurrentTicket(data);
            });
    };
    const handleSendMessage = async (message: string) => {
        if (!currentTicket?.ticketId) return await handleOpenTicket(message);
        //     public async Task<Message> SendMessage(Guid ticketId, string content, string userId)
        signalRStore.connection
            ?.invoke('SendMessage', currentTicket?.ticketId, message, currentUser?.id)
            .finally(() => {});
    };
    return (
        <div
            css={css`
                position: fixed;
                bottom: 0;
                z-index: 1000;
                right: 0;
            `}
        >
            {!value && isPatient && <Button onClick={toggle}>Hỗ trợ</Button>}
            {value && (
                <MainContainer style={{ width: '400px', height: '600px' }}>
                    <ChatContainer>
                        <ConversationHeader
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                            }}
                        >
                            <ConversationHeader.Content
                                info={ticket?.doctor?.name || 'Yêu cầu hỗ trợ'}
                                userName={ticket?.doctor?.name || 'Hỗ trợ'}
                            />
                            <ConversationHeader.Actions>
                                <CloseButton onClick={toggle} />
                            </ConversationHeader.Actions>
                        </ConversationHeader>
                        <MessageList loading={isFetching} loadingMore={isFetchingNextPage}>
                            {orderedMessages?.map((message) => (
                                <Message
                                    key={message.messageId}
                                    model={{
                                        sender: message.userId == currentUser?.id ? 'Bạn' : 'Hỗ trợ viên',
                                        direction: message.userId == currentUser?.id ? 'outgoing' : 'incoming',
                                        position: 'last',
                                        type: 'text',
                                        message: message.content!,
                                    }}
                                />
                            ))}
                        </MessageList>
                        <MessageInput onSend={handleSendMessage} attachButton={false} placeholder="Nhập tin nhắn" />
                    </ChatContainer>
                </MainContainer>
            )}
        </div>
    );
}
