import React from "react";
import {
    Box,
    Grid,
    TextField,
    MenuItem,
    IconButton,
    FormControlLabel,
    Checkbox
} from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";

import { useThemeContext } from "../ThemeContext/ThemeContext";
import { IGroup } from "../../interfaces";

interface OrderFiltersProps {
    filters: {
        course: string;
        courseFormat: string;
        courseType: string;
        status: string;
        name: string;
        surname: string;
        phone: string;
        email: string;
        group: string;
        age: string;
        alreadyPaid: string;
        sum: string;
        created_at_after: string;
        created_at_before: string;
        manager: string;
    };
    userId?: string | number;
    groups: IGroup[];
    username: string;
    handleFilterChange: (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDateChange: (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleResetFilters: () => void;
    setSearchParams: (params: URLSearchParams | ((prev: URLSearchParams) => URLSearchParams)) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
                                                       username,
                                                       filters,
                                                       userId,
                                                       groups,
                                                       handleFilterChange,
                                                       handleDateChange,
                                                       handleResetFilters,
                                                       setSearchParams
                                                   }) => {
    const { darkMode } = useThemeContext();
    const [searchParams] = useSearchParams();

    return (
        <Box sx={{ p: 2, backgroundColor: darkMode ? "#28293D" : "#fdfdff", borderRadius: 2 }}>
            <Grid container spacing={2}>

                <Grid item xs={12} sm={1.5}>
                    <TextField select fullWidth label="course" value={filters.course} onChange={handleFilterChange("course")}>
                        <MenuItem value="">All courses</MenuItem>
                        <MenuItem value="FS">FS</MenuItem>
                        <MenuItem value="QACX">QACX</MenuItem>
                        <MenuItem value="JCX">JCX</MenuItem>
                        <MenuItem value="JSCX">JSCX</MenuItem>
                        <MenuItem value="FE">FE</MenuItem>
                        <MenuItem value="PCX">PCX</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={1.5}>
                    <TextField select fullWidth label="courseFormat" value={filters.courseFormat} onChange={handleFilterChange("courseFormat")}>
                        <MenuItem value="">All formats</MenuItem>
                        <MenuItem value="static">static</MenuItem>
                        <MenuItem value="online">online</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={1.5}>
                    <TextField select fullWidth label="courseType" value={filters.courseType} onChange={handleFilterChange("courseType")}>
                        <MenuItem value="">All types</MenuItem>
                        <MenuItem value="pro">pro</MenuItem>
                        <MenuItem value="minimal">minimal</MenuItem>
                        <MenuItem value="premium">premium</MenuItem>
                        <MenuItem value="incubator">incubator</MenuItem>
                        <MenuItem value="vip">vip</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={1.5}>
                    <TextField select fullWidth label="status" value={filters.status} onChange={handleFilterChange("status")}>
                        <MenuItem value="">All statuses</MenuItem>
                        <MenuItem value="In work">In work</MenuItem>
                        <MenuItem value="New">New</MenuItem>
                        <MenuItem value="Aggre">Aggre</MenuItem>
                        <MenuItem value="Disaggre">Disaggre</MenuItem>
                        <MenuItem value="Dubbing">Dubbing</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={1.5}>
                    <TextField fullWidth label="name" value={filters.name} onChange={handleFilterChange("name")} />
                </Grid>
                <Grid item xs={12} sm={1.5}>
                    <TextField fullWidth label="surname" value={filters.surname} onChange={handleFilterChange("surname")} />
                </Grid>
                <Grid item xs={12} sm={1.5}>
                    <TextField fullWidth label="phone" value={filters.phone} onChange={handleFilterChange("phone")} />
                </Grid>
                <Grid item xs={12} sm={1.5} display="flex" alignItems="center">
                    <IconButton onClick={handleResetFilters} sx={{ borderRadius: "50%", backgroundColor: darkMode ? "#28293D" : "#fdfdff", "&:hover": { backgroundColor: "#e0e0e0" } }}>
                        <Refresh />
                    </IconButton>
                </Grid>

                <Grid item xs={12} sm={1.5}>
                    <TextField fullWidth label="email" value={filters.email} onChange={handleFilterChange("email")} />
                </Grid>
                <Grid item xs={12} sm={1.5}>
                    <TextField select fullWidth label="Group" value={filters.group} onChange={handleFilterChange("group")}>
                        <MenuItem value="">All groups</MenuItem>
                        {groups.map((grp) => (
                            <MenuItem key={grp.id} value={grp.id}>{grp.group_name}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={1.5}>
                    <TextField fullWidth label="age" type="number" value={filters.age} onChange={handleFilterChange("age")} />
                </Grid>
                <Grid item xs={12} sm={1.5}>
                    <TextField fullWidth label="alreadyPaid" type="number" value={filters.alreadyPaid} onChange={handleFilterChange("alreadyPaid")} />
                </Grid>
                <Grid item xs={12} sm={1.5}>
                    <TextField fullWidth label="sum" type="number" value={filters.sum} onChange={handleFilterChange("sum")} />
                </Grid>
                <Grid item xs={12} sm={1.5}>
                    <TextField fullWidth label="created_at_after" type="date" InputLabelProps={{ shrink: true }} value={filters.created_at_after} onChange={handleDateChange("created_at_after")} />
                </Grid>
                <Grid item xs={12} sm={1.5}>
                    <TextField fullWidth label="created_at_before" type="date" InputLabelProps={{ shrink: true }} value={filters.created_at_before} onChange={handleDateChange("created_at_before")} />
                </Grid>
                <Grid item xs={12} sm={1.5}>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={searchParams.get("manager") === username}
                                onChange={(e) =>
                                    setSearchParams(prev => {
                                        const newParams = new URLSearchParams(prev);
                                        if (e.target.checked && userId) {
                                            newParams.set("manager", username );
                                        } else {
                                            newParams.delete("manager");
                                        }
                                        newParams.set("page", "1");
                                        return newParams;
                                    })
                                }
                            />
                        }
                        label="My orders"
                    />
                </Grid>
            </Grid>
        </Box>
    );
};

export {OrderFilters};
