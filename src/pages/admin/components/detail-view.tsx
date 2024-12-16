import React from 'react';
import { Card, CardContent, Dialog, Typography, List, ListItem, ListItemText, ListSubheader, Link, Box, DialogContent } from '@mui/material';
import { DialogProps } from '@toolpad/core';

export interface IDetailView {
    label: string;
    isGroup?: boolean;
    children?: IDetailView[];
    value?: string | number | boolean | undefined;
    href?: string;
    render?: (value: any) => JSX.Element;
}

export interface DetailViewProps {
    data: IDetailView[];
}

export function DetailView({ data }: DetailViewProps) {
    return (
        <Card>
            <CardContent>
                <List>
                    {data.map((item, index) => (
                        <React.Fragment key={index}>
                            {item.isGroup ? (
                                <ListSubheader disableSticky>
                                    <Typography variant="h6">{item.label}</Typography>
                                </ListSubheader>
                            ) : (
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            item.href ? (
                                                <Link href={item.href} target="_blank" rel="noopener noreferrer">
                                                    {item.label}
                                                </Link>
                                            ) : (
                                                item.label
                                            )
                                        }
                                        secondary={
                                            item.render
                                                ? item.render(item.value)
                                                : item.value !== undefined
                                                  ? String(item.value)
                                                  : null
                                        }
                                    />
                                </ListItem>
                            )}

                            {item.children && (
                                <Box pl={2}>
                                    {item.children.map((child, childIndex) => (
                                        <ListItem key={childIndex}>
                                            <ListItemText
                                                primary={
                                                    child.href ? (
                                                        <Link
                                                            href={child.href}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                        >
                                                            {child.label}
                                                        </Link>
                                                    ) : (
                                                        child.label
                                                    )
                                                }
                                                secondary={
                                                    child.render
                                                        ? child.render(child.value)
                                                        : child.value !== undefined
                                                        ? String(child.value)
                                                        : null
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </Box>
                            )}
                        </React.Fragment>
                    ))}
                </List>
            </CardContent>
        </Card>
    );
}


export function DetailViewModal({ payload, open, onClose }: DialogProps<DetailViewProps>) {
    return (
        <Dialog 
            onClose={onClose as any}
            open={open}
            fullWidth
            maxWidth="md"
        >
            <DialogContent>
                <DetailView data={payload.data} />
            </DialogContent>
        </Dialog>
    );
}