import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import * as XLSX from "xlsx";
import { Button } from "@mui/material";

import { saveAs } from "file-saver";
import {IOrder} from '../../interfaces'
import { orderService } from "../../services";

import styles from "./ExcelButton.module.css";

const ExportToExcel = () => {
    const [searchParams] = useSearchParams();
    const [progress, setProgress] = useState<number | null>(null);

    const fetchAllOrders = async () => {
        try {
            let allOrders: IOrder[] = [];
            let page = 1;
            let totalPages = 1;

            setProgress(0);

            do {
                const searchParamsObj = Object.fromEntries(searchParams);
                delete searchParamsObj.page;

                const response = await orderService.getAll(page, undefined, searchParamsObj);
                const data = response.data;

                allOrders = [...allOrders, ...data.data];
                totalPages = data.total_pages;

                setProgress(Math.round((page / totalPages) * 100));

                page++;
            } while (page <= totalPages);

            setProgress(null);
            return allOrders;
        } catch (error) {
            console.error("Fetch error:", error);
            alert(`Failed to fetch orders: ${error}`);
            setProgress(null);
            return [];
        }
    };


    const exportToExcel = async () => {
        try {
            const orders = await fetchAllOrders();
            if (!orders.length) {
                alert("No data to export");
                return;
            }

            const formattedData = orders.map((order: IOrder) => ({
                id: order.id,
                name: order.name,
                surname: order.surname,
                email: order.email,
                phone: order.phone,
                age: order.age,
                course: order.course,
                course_format: order.course_format,
                course_type: order.course_type,
                sum: order.sum,
                alreadyPaid: order.alreadyPaid,
                utm: order.utm,
                msg: order.msg,
                status: order.status,
                created_at: order.created_at,
                group: order.group ? order.group.group_name : "",
                manager: order.manager ? order.manager.username : "",
                comments: order.comments || ""
            }));

            console.log("Formatted data for export:", formattedData);

            const worksheet = XLSX.utils.json_to_sheet(formattedData);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

            const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
            const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
            saveAs(blob, "orders.xlsx");

        } catch (error) {
            console.error("Export error:", error);
            alert(`Export failed: ${error}`);
        }
    };

    return (
        <button className={styles.button} onClick={exportToExcel}>
            <svg
                strokeLinejoin="round"
                strokeLinecap="round"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
                className={styles.button__icon}
                xmlns="http://www.w3.org/2000/svg"
            >
                <path fill="none" d="M0 0h24v24H0z" stroke="none"></path>
                <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"></path>
                <path d="M7 11l5 5l5 -5"></path>
                <path d="M12 4l0 12"></path>
            </svg>
            <span>.xlsx</span>
            {progress !== null && (
                <div className={styles.progress}>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
                    </div>
                    <span>{progress}%</span>
                </div>
            )}
        </button>

    );
};

export { ExportToExcel };