import { getDoctorTickets, getMessages, getUnAssignedTickets, useGetDoctorTickets } from '@/services/api';
import { useUserProfile } from '@/stores/user-store';
import { MessageDTO, TicketDTO } from '@/types';
import {
    ChatContainer,
    ConversationHeader,
    MainContainer,
    Message,
    MessageInput,
    MessageList,
} from '@chatscope/chat-ui-kit-react';
import IconButton from '@mui/material/IconButton';
import { Avatar, Box, List, ListItem, ListItemText, Menu, MenuItem, Tab, Tabs, Typography } from '@mui/material';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { CloseButton } from 'react-bootstrap';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import useSignalRStore from '@/stores/signalRStore';

export default function SupportTicket() {
    const [value, setValue] = React.useState(0);
    const profile = useUserProfile();
    const [selectedTicket, setSelectedTicket] = React.useState<TicketDTO | null>(null);
    const [messageKey, setMessageKey] = React.useState(0);
    const [ticketKey, setTicketKey] = React.useState(0);
    const signalRStore = useSignalRStore();

    const {
        data: doctorTicks,
        isFetchingNextPage: fetchNextDoctorTickets,
        refetch: refetchDoctorTicks,
    } = useInfiniteQuery({
        queryKey: ['doctor-tickets', profile?.doctorId, ticketKey],
        queryFn: async ({ pageParam }) => {
            const rest = await getDoctorTickets({
                doctorId: profile?.doctor?.doctorId,
                Page: pageParam,
                PageSize: 20,
            });
            return {
                nextCursor: pageParam + 1,
                pages: rest.data?.data,
            };
        },
        enabled: !!profile?.doctor?.doctorId,
        getNextPageParam: (lastPage: any) => lastPage.nextCursor,
        initialData: {
            pageParams: [1],
            pages: [],
        },
        initialPageParam: 1,
        select: (data) => ({
            pageParams: [...data.pageParams],
            pages: [...data.pages],
        }),
    });
    const {
        data: unassignedTicks,
        isFetchingNextPage: fetchNextUnassignedTickets,
        refetch: refetchUnassignedTicks,
    } = useInfiniteQuery({
        queryKey: ['unassigned-tickets', ticketKey],
        queryFn: async ({ pageParam }) => {
            const rest = await getUnAssignedTickets({
                Page: pageParam,
                PageSize: 20,
            });
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
        select: (data) => ({
            pageParams: [...data.pageParams],
            pages: [...data.pages],
        }),
    });
    const {
        data: messages,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        refetch,
    } = useInfiniteQuery({
        queryKey: ['messages', selectedTicket?.ticketId!, messageKey],
        queryFn: async ({ pageParam }) => {
            const rest = await getMessages(selectedTicket?.ticketId!, { PageSize: 10, Page: pageParam });
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
        enabled: !!selectedTicket?.ticketId,
        initialPageParam: 1,
        select: (data) => ({
            pageParams: [...data.pageParams],
            pages: [...data.pages],
        }),
    });

    React.useEffect(() => {
        console.log('register event', signalRStore.connection);
        const handleNewMessage = (data: any) => {
            console.log(data);
            setMessageKey((prev) => prev + 1);
        };
        const handleNewTicket = (data: any) => {
            console.log(data);
            setTicketKey((prev) => prev + 1);
        };
        signalRStore.connection?.on('NewMessage', handleNewMessage);
        signalRStore.connection?.on('NewTicket', handleNewTicket);
        return () => {
            signalRStore.connection?.off('NewMessage', handleNewMessage);
            signalRStore.connection?.off('NewTicket', handleNewTicket);
        };
    }, [signalRStore.connection]);

    const orderedMessages = React.useMemo(() => {
        return (
            messages?.pages.reduce((acc, page) => {
                return [...acc, ...page.pages];
            }, []) as MessageDTO[]
        ).reverse();
    }, [messages.pages.length]);

    const flatedDoctorTickets = React.useMemo(() => {
        if (!doctorTicks.pages) return [];
        return doctorTicks?.pages.reduce((acc, page) => {
            if (!page.pages) return;
            return [...acc, ...page.pages];
        }, []) as TicketDTO[];
    }, [doctorTicks.pages.length]);
    const flatedUnassignedTickets = React.useMemo(() => {
        if (!unassignedTicks.pages) return [];
        return unassignedTicks?.pages.reduce((acc, page) => {
            console.log(page);
            if (!page.pages) return acc;
            return [...acc, ...page.pages];
        }, []) as TicketDTO[];
    }, [unassignedTicks.pages.length]);

    function handleClosedTicket(ticketId: string) {
        signalRStore.connection?.invoke('CloseTicket', ticketId).then(() => {
            setTicketKey((prev) => prev + 1);
        });
    }
    const handleReplyTicket = (ticketId: string) => {
        signalRStore.connection?.invoke('AssignDoctor', ticketId, profile?.doctor?.doctorId).then(() => {
            setTicketKey((prev) => prev + 1);
        });
    };

    return (
        <Box sx={{ height: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={value}
                    onChange={(_, v) => {
                        setValue(v);
                    }}
                    aria-label="basic tabs example"
                >
                    <Tab label="Của tôi" value={0} />
                    <Tab label="Chưa xử lý" value={1} />
                </Tabs>
            </Box>
            <Box sx={{ display: 'flex', height: 'calc(100% - 50px)', flexDirection: 'row' }}>
                {value === 0 && (
                    <TicketPanel
                        tickets={flatedDoctorTickets}
                        selectedTicket={selectedTicket}
                        setSelectedTicket={setSelectedTicket}
                        onClosedTicket={handleClosedTicket}
                        onReplyTicket={handleReplyTicket}
                    />
                )}
                {value === 1 && (
                    <TicketPanel
                        tickets={flatedUnassignedTickets}
                        selectedTicket={selectedTicket}
                        setSelectedTicket={setSelectedTicket}
                        onClosedTicket={handleClosedTicket}
                        onReplyTicket={handleReplyTicket}
                    />
                )}
                <Box sx={{ flex: 1 }}>
                    <MainContainer style={{ width: '100%', height: '100%' }}>
                        <ChatContainer>
                            <ConversationHeader
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <ConversationHeader.Content
                                    userName={selectedTicket?.patient?.name || ''}
                                    info={selectedTicket?.patient?.phoneNumber || selectedTicket?.patient?.email || ''}
                                />
                                <ConversationHeader.Actions></ConversationHeader.Actions>
                            </ConversationHeader>
                            <MessageList loading={isFetching} loadingMore={isFetchingNextPage}>
                                {orderedMessages?.map((message) => (
                                    <Message
                                        key={message.messageId}
                                        model={{
                                            sender:
                                                message.userId == profile?.id ? 'Bạn' : selectedTicket?.patient?.name!,
                                            direction: message.userId == profile?.id ? 'outgoing' : 'incoming',
                                            position: 'last',
                                            type: 'text',
                                            message: message.content!,
                                        }}
                                    />
                                ))}
                            </MessageList>
                            <MessageInput
                                attachButton={false}
                                placeholder="Nhập tin nhắn"
                                disabled={!selectedTicket || selectedTicket.isClosed || !selectedTicket.doctorId}
                                onSend={(message) => {
                                    signalRStore.connection
                                        ?.invoke('SendMessage', selectedTicket?.ticketId, message, profile?.id)
                                        .then(() => {
                                            setMessageKey((prev) => prev + 1);
                                        });
                                }}
                            />
                        </ChatContainer>
                    </MainContainer>
                </Box>
            </Box>
        </Box>
    );
}
interface TicketPanelProps {
    tickets: TicketDTO[];
    selectedTicket: TicketDTO | null;
    setSelectedTicket: (ticket: TicketDTO) => void;
    onClosedTicket: (ticketId: string) => void;
    onReplyTicket: (ticketId: string) => void;
}
function TicketPanel({ tickets, selectedTicket, setSelectedTicket, onClosedTicket, onReplyTicket }: TicketPanelProps) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const handleClickMenu = (event: React.MouseEvent<HTMLElement>, ticketId: string) => {
        setAnchorEl(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleCloseTicket = () => {
        handleCloseMenu();
        if (selectedTicket) {
            onClosedTicket(selectedTicket.ticketId!);
        }
    };

    const handleReply = () => {
        handleCloseMenu();
        if (selectedTicket) {
            onReplyTicket(selectedTicket.ticketId!);
        }
    };
    return (
        <Box
            width={300}
            height={'100%'}
            sx={{
                backgroundColor: 'rgba(0,0,0,0.03)',
            }}
        >
            <List>
                {!tickets.length && (
                    <ListItem>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            Không có dữ liệu
                        </Typography>
                    </ListItem>
                )}
                {tickets.map((ticket) => (
                    <ListItem
                        key={ticket.ticketId}
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            marginBottom: 2,
                            backgroundColor: selectedTicket?.ticketId === ticket.ticketId ? 'rgba(0,0,0,0.1)' : '',
                            cursor: ticket.isClosed ? 'not-allowed' : 'pointer',
                        }}
                        onClick={() => setSelectedTicket(ticket)}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            {/* Avatar */}
                            <Avatar sx={{ bgcolor: 'primary.main', marginRight: 2 }}>
                                {ticket.patient?.name?.charAt(0)}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    {ticket.patient?.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {ticket.lastMessage}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    {ticket.lastMessageAt
                                        ? new Date(ticket.lastMessageAt).toLocaleString()
                                        : 'Chưa có tin nhắn'}{' '}
                                </Typography>
                            </Box>
                        </Box>
                        <Box>
                            <IconButton onClick={(e) => handleClickMenu(e, ticket.ticketId!)}>
                                <MoreVertIcon />
                            </IconButton>
                        </Box>
                        <Menu
                            anchorEl={anchorEl}
                            open={selectedTicket?.ticketId === ticket.ticketId && Boolean(anchorEl)}
                            onClose={handleCloseMenu}
                        >
                            <MenuItem onClick={handleCloseTicket}>
                                <ListItemText primary="Đóng ticket" />
                            </MenuItem>
                            <MenuItem onClick={handleReply}>
                                <ListItemText primary="Nhận trả lời" />
                            </MenuItem>
                        </Menu>
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}
