import { TableRow, TableCell, Button, TextField, Box, Modal, Grid, Typography, MenuItem, Select, IconButton } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";

import {IGroup, IOrder } from "../../interfaces";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { GroupSelector } from "../GroupSelector/GroupSelector";
import { EditOrderModal } from "../EditOrderModal/EditOrderModal";
import { orderSliceActions  } from "../../redux";
import { useThemeContext } from "../ThemeContext/ThemeContext";

import styles from "./DeleteCommentBtn.module.css"

interface OrderProps {
    order: IOrder;
}

const OrderInfo: FC<OrderProps> = ({ order }) => {
    const dispatch = useAppDispatch();
    const { userData } = useAppSelector((state) => state.user);

    const orderFromState = useAppSelector(state =>
        state.orders.orders.find(o => o.id === order.id)
    );

    const currentOrder = orderFromState || order;

    const [isExpanded, setIsExpanded] = useState(false);
    const [text, setComment] = useState("");
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [editedOrder, setEditedOrder] = useState<IOrder>(currentOrder);

    const canComment = userData && (!currentOrder.manager || currentOrder.manager.username === userData.username);
    const { darkMode } = useThemeContext();

    useEffect(() => {
        if (orderFromState) {
            setEditedOrder(orderFromState);
        }
    }, [orderFromState]);

    const handleToggleExpand = () => {
        setIsExpanded((prev) => !prev);
    };

    const handleCommentSubmit = async () => {
        if (!text.trim()) return;

        try {
            await dispatch(orderSliceActions.addCommentToOrder({ orderId: currentOrder.id, text }));
            setComment("");
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        try {
            await dispatch(orderSliceActions.deleteCommentFromOrder({ orderId: currentOrder.id, commentId }));
        } catch (error) {
            console.error("Error deleting comment:", error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedOrder((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditClick = () => {
        setEditedOrder(currentOrder);
        setEditModalOpen(true);
    };


    return (
        <>
            <TableRow
                onClick={handleToggleExpand}
                sx={{
                    cursor: "pointer",
                    backgroundColor: isExpanded
                        ? (darkMode ? "gray" : "#f1f1f1")
                        : "inherit"
                }}
            >
                <TableCell>{order.id}</TableCell>
                <TableCell>{order.name}</TableCell>
                <TableCell>{order.surname}</TableCell>
                <TableCell>{order.email}</TableCell>
                <TableCell>{order.phone}</TableCell>
                <TableCell>{order.age}</TableCell>
                <TableCell>{order.course}</TableCell>
                <TableCell>{order.course_format}</TableCell>
                <TableCell>{order.course_type}</TableCell>
                <TableCell>{order.status}</TableCell>
                <TableCell>{order.sum || "null"}</TableCell>
                <TableCell>{order.alreadyPaid || "null"}</TableCell>
                <TableCell>{order.group?.group_name || "null"}</TableCell>
                <TableCell>
                    {order.created_at ? new Date(order.created_at).toLocaleDateString() : "null"}
                </TableCell>
                <TableCell>{order.manager?.username || "null"}</TableCell>
            </TableRow>

            {isExpanded && (
                <TableRow>
                    <TableCell colSpan={15}>
                        <Box sx={{ padding: 2, border: "1px solid #ccc", borderRadius: 2 }}>
                            <p><strong>Message:</strong> {order.msg || "null"}</p>
                            <p><strong>UTM:</strong> {order.utm || "null"}</p>

                            <Box sx={{ marginTop: 2, maxHeight: 200, overflowY: "auto" }}>
                                {currentOrder.comments?.length > 0 ? (
                                    currentOrder.comments.map((comment) => (
                                        <Box key={comment.id} sx={{ borderBottom: "1px solid #ddd", paddingBottom: 1, marginBottom: 1 }}>
                                            <p><strong>{comment.author.username}</strong> - {new Date(comment.created_at).toLocaleString()}
                                                {(userData?.username === comment.author.username || userData?.role === "manager") && (
                                                    <IconButton
                                                        onClick={() => handleDeleteComment(comment.id)}
                                                        color="error"
                                                        sx={{
                                                            backgroundColor: "#b81414",
                                                            "&:hover": { backgroundColor: "darkred" },
                                                            marginLeft: "5px"
                                                        }}
                                                    >
                                                        <DeleteIcon sx={{ color: "white" }} />
                                                    </IconButton>
                                                )}
                                            </p>
                                            <p>{comment.text}</p>
                                        </Box>
                                    ))
                                ) : (
                                    <p style={{ color: "gray" }}>No comments yet</p>
                                )}
                            </Box>

                            {canComment ? (
                                <Box sx={{ display: "flex", gap: 1, alignItems: "center", marginTop: 1 }}>
                                    <TextField
                                        value={text}
                                        onChange={(e) => setComment(e.target.value)}
                                        label="Enter your comment"
                                        fullWidth
                                        size="small"
                                    />
                                    <Button variant="contained" color="primary" onClick={handleCommentSubmit}>
                                        Submit
                                    </Button>

                                    <Button variant="contained" color="primary" size="small" onClick={handleEditClick}>
                                        EDIT
                                    </Button>
                                </Box>
                            ) : (
                                <p style={{ color: "gray" }}>You cannot comment on this order</p>
                            )}
                        </Box>
                    </TableCell>
                </TableRow>
            )}
            <EditOrderModal open={isEditModalOpen} onClose={() => setEditModalOpen(false)} order={order} />
        </>
    );

};

export { OrderInfo };


