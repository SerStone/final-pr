import React, { FC, useEffect, useState } from "react";
import { Modal, Box, Button, TextField, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { IOrder, IGroup } from "../../interfaces";
import { useAppDispatch } from "../../hooks";

import { GroupSelector } from "../GroupSelector/GroupSelector";
import { orderSliceActions } from "../../redux";

interface EditOrderModalProps {
    open: boolean;
    onClose: () => void;
    order: IOrder;
}

const EditOrderModal: FC<EditOrderModalProps> = ({ open, onClose, order }) => {
    const dispatch = useAppDispatch();
    const [editedOrder, setEditedOrder] = useState<IOrder>(order);
    const [groups, setGroups] = useState<IGroup[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<number | null>(order.group?.id || null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        if (name) {
            setEditedOrder((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedOrder((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;

        if (name === "group") {
            setSelectedGroup(value ? Number(value) : null);
            setEditedOrder((prev) => ({ ...prev, group: value ? { id: Number(value) } : null }));
        } else if (value === "") {
            setEditedOrder((prev) => ({ ...prev, [name]: null }));
        } else {
            setEditedOrder((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSaveChanges = async () => {
        try {
            setLoading(true);
            await dispatch(orderSliceActions.updateOrder({
                orderId: editedOrder.id,
                updatedData: {
                    ...editedOrder,
                    group_id: selectedGroup,
                },
            })).unwrap();

            onClose(); // Закриваємо модалку
        } catch (error) {
            console.error("Error updating order:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open) {
            setEditedOrder(order);
            setSelectedGroup(order.group?.id || null);
        }
    }, [open, order]);

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 600,
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
                    <Box>
                        <GroupSelector
                            selectedGroup={selectedGroup}
                            group_name={editedOrder.group?.group_name}
                            setSelectedGroup={(groupId) => {
                                setSelectedGroup(groupId);
                                setEditedOrder((prev) => ({ ...prev, group: groupId ? { id: groupId } : null }));
                            }}
                            orderId={editedOrder.id}
                        />
                    </Box>
                    <Box>
                        <p>Status</p>
                        <Select
                            fullWidth
                            size="small"
                            name="status"
                            value={editedOrder.status ?? ""}
                            onChange={(e) => setEditedOrder({ ...editedOrder, status: e.target.value || null })}
                        >
                            <MenuItem value="">Select status</MenuItem>
                            <MenuItem value="In work">In work</MenuItem>
                            <MenuItem value="New">New</MenuItem>
                            <MenuItem value="Aggre">Aggre</MenuItem>
                            <MenuItem value="Disaggre">Disaggre</MenuItem>
                            <MenuItem value="Dubbing">Dubbing</MenuItem>
                        </Select>
                    </Box>
                    <TextField fullWidth label="Name" size="small" name="name" value={editedOrder.name} onChange={handleTextFieldChange} />
                    <TextField fullWidth label="Surname" size="small" name="surname" value={editedOrder.surname} onChange={handleTextFieldChange} />
                    <TextField fullWidth label="Email" size="small" name="email" value={editedOrder.email} onChange={handleTextFieldChange} />
                    <TextField fullWidth label="Phone" size="small" name="phone" value={editedOrder.phone} onChange={handleTextFieldChange} />
                    <TextField
                        fullWidth
                        label="Age"
                        size="small"
                        name="age"
                        value={editedOrder.age !== null ? editedOrder.age.toString() : ""}
                        onChange={(e) =>
                            setEditedOrder({ ...editedOrder, age: e.target.value === "" ? null : Number(e.target.value) })
                        }
                    />
                    <TextField
                        fullWidth
                        label="Sum"
                        size="small"
                        name="sum"
                        value={editedOrder.sum !== null ? editedOrder.sum.toString() : ""}
                        onChange={(e) =>
                            setEditedOrder({ ...editedOrder, sum: e.target.value === "" ? null : Number(e.target.value) })
                        }
                    />
                    <TextField
                        fullWidth
                        label="Already Paid"
                        size="small"
                        name="alreadyPaid"
                        value={editedOrder.alreadyPaid !== null ? editedOrder.alreadyPaid.toString() : ""}
                        onChange={(e) =>
                            setEditedOrder({ ...editedOrder, alreadyPaid: e.target.value === "" ? null : Number(e.target.value) })
                        }
                    />
                    <Select
                        fullWidth
                        size="small"
                        name="course"
                        value={editedOrder.course}
                        onChange={(e) => setEditedOrder({ ...editedOrder, course: e.target.value || null })}
                    >
                        <MenuItem value="">Select course</MenuItem>
                        <MenuItem value="FS">FS</MenuItem>
                        <MenuItem value="QACX">QACX</MenuItem>
                        <MenuItem value="JCX">JCX</MenuItem>
                        <MenuItem value="JSCX">JSCX</MenuItem>
                        <MenuItem value="FE">FE</MenuItem>
                        <MenuItem value="PCX">PCX</MenuItem>
                    </Select>
                    <Select
                        fullWidth
                        size="small"
                        label="course_format"
                        name="course_format"
                        value={editedOrder.course_format}
                        onChange={(e) => setEditedOrder({ ...editedOrder, course_format: e.target.value || null })}
                    >
                        <MenuItem value="">Select format</MenuItem>
                        <MenuItem value="static">Static</MenuItem>
                        <MenuItem value="online">Online</MenuItem>
                    </Select>
                    <Select
                        fullWidth
                        label="course_type"
                        size="small"
                        name="course_type"
                        value={editedOrder.course_type}
                        onChange={(e) => setEditedOrder({ ...editedOrder, course_type: e.target.value || null })}
                    >
                        <MenuItem value="">Select type</MenuItem>
                        <MenuItem value="pro">Pro</MenuItem>
                        <MenuItem value="minimal">Minimal</MenuItem>
                        <MenuItem value="premium">Premium</MenuItem>
                        <MenuItem value="incubator">Incubator</MenuItem>
                        <MenuItem value="vip">VIP</MenuItem>
                    </Select>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
                    <Button variant="contained" color="success" onClick={handleSaveChanges}>
                        SUBMIT
                    </Button>
                    <Button variant="contained" color="secondary" onClick={onClose}>
                        CLOSE
                    </Button>
                </Box>
            </Box>
        </Modal>


    );
};

export { EditOrderModal };
