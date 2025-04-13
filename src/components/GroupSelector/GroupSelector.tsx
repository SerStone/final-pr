import React, { useEffect, useState, useCallback, FC } from "react";
import { Box, Button, CircularProgress, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { IGroup } from "../../interfaces";
import { useAppDispatch, useAppSelector } from "../../hooks";

import { groupSliceActions } from "../../redux";

interface GroupSelectorProps {
    selectedGroup: number | null;
    setSelectedGroup: (group: number | null) => void;
    orderId: number;
    group_name?: string;
}

const GroupSelector: FC<GroupSelectorProps> = ({ selectedGroup, setSelectedGroup, orderId, group_name }) => {
    const dispatch = useAppDispatch();
    const { groups, isLoading, errors } = useAppSelector((state) => state.groups);
    const [isAddingGroup, setIsAddingGroup] = useState<boolean>(false);
    const [newGroupName, setNewGroupName] = useState<string>("");

    const fetchGroups = useCallback(() => {
        dispatch(groupSliceActions.getAllGroups());
    }, [dispatch]);

    useEffect(() => {
        if (!groups.length) {
            fetchGroups();
        }
    }, [fetchGroups, groups]);

    const handleCreateGroup = async () => {
        if (!newGroupName.trim()) return;

        try {
            await dispatch(groupSliceActions.createGroup(newGroupName));
            setIsAddingGroup(false);
            setNewGroupName("");
            fetchGroups();
        } catch (error) {
            console.error("Error creating group:", error);
        }
    };

    const handleApplyGroup = async () => {
        if (selectedGroup === null) return;
        try {
            console.log(`Order ${orderId} updated with group ${selectedGroup}`);
        } catch (error) {
            console.error("Error updating order group:", error);
        }
    };

    return (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
            <p>Group</p>

            {!isAddingGroup ? (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                    <Select
                        fullWidth
                        size="small"
                        value={selectedGroup?.toString() ?? ""}
                        onChange={(e: SelectChangeEvent<string>) => setSelectedGroup(e.target.value ? Number(e.target.value) : null)}
                    >
                        {isLoading ? (
                            <MenuItem disabled>
                                <CircularProgress size={24} />
                            </MenuItem>
                        ) : errors ? (
                            <MenuItem disabled>{errors}</MenuItem>
                        ) : Array.isArray(groups) && groups.length > 0 ? (
                            groups.map((group) => (
                                <MenuItem key={group.id} value={group.id}>
                                    {group.group_name}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No groups</MenuItem>
                        )}
                    </Select>
                    <Box sx={{ display: "flex", gap: 1 }}>
                        <Button variant="contained" color="primary" onClick={() => setIsAddingGroup(true)}>
                            Add
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleApplyGroup}
                            disabled={selectedGroup === null}
                        >
                            Apply
                        </Button>
                    </Box>
                </Box>
            ) : (
                <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        size="small"
                        placeholder="New group name"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                    />
                    <Button variant="contained" color="success" onClick={handleCreateGroup}>
                        Save
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => { setIsAddingGroup(false); setNewGroupName(""); }}>
                        Cancel
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export { GroupSelector };

