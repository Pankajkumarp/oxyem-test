"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  DndContext, DragEndEvent, DragOverEvent, DragStartEvent,
  PointerSensor, useSensor, useSensors, DragOverlay, closestCorners,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import KanbanColumn from "./KanbanColumn";
import MilestoneCard from "./MilestoneCard";
import { axiosJWT } from '../../../Auth/AddAuthorization';
import { toast } from 'react-hot-toast';


interface Assignee { id: string; initials: string; ProfilePic: string; }
interface Milestone {
  id: string; title: string; description: string; date: string;
  status: string; isOverdue?: boolean; isBlocked?: boolean;
  isCompleted?: boolean; assignees: Assignee[];
}
interface Column { id: string; title: string; dotColor: string; }



type KanbanBoardProps = {
  idTimesheet: string; 
  mentionUser: []; 
};

type Status = string & {};
export default function KanbanBoard({ idTimesheet, mentionUser }: Readonly<KanbanBoardProps>) {
  const normalizeStatus = (status: string): string =>
  status?.toLowerCase().trim();
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const [columns, setColumns] = useState<Column[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const getListDetails = async (id) => {
    try {
      const response = await axiosJWT.get(`${apiUrl}/timesheet/getTaskBoard`, {
        params: { id },
      });

      const apiData = response?.data?.data;

      if (apiData) {
        const formattedColumns: Column[] = apiData.columnName.map((col) => ({
  id: normalizeStatus(col.id),
  title: col.title,
  dotColor: col.dotColor,
}));

const formattedMilestones: Milestone[] = apiData.columnData.map((item) => ({
  id: item.id,
  title: item.title,
  description: item.description,
  date: item.date,
  status: normalizeStatus(item.status),
  assignees: item.assignees.map((a, index) => ({
    id: index.toString(),
    initials: a.employeeName,
    ProfilePic: a.ProfilePic,
  })),
}));
        setMilestones(formattedMilestones);
        setColumns(formattedColumns);
      }
    } catch (error) {
      console.error("Error fetching board:", error);
    }
  };
  useEffect(() => {
    getListDetails(idTimesheet)
  }, [idTimesheet]);
  const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const getMilestonesForColumn = useCallback(
    (status: string) => milestones.filter((m) => m.status === status),
    [milestones]
  );


  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    if (activeId === overId) return;

    const activeItem = milestones.find((m) => m.id === activeId);
    if (!activeItem) return;

    const isOverColumn = columns.some((col) => col.id === overId);
    if (isOverColumn) {
      const newStatus = overId as Status;
      if (activeItem.status !== newStatus) {
        setMilestones((prev) => prev.map((m) =>
          m.id === activeId
            ? { ...m, status: newStatus, isOverdue: false, isBlocked: newStatus === "blocked", isCompleted: newStatus === "completed" }
            : m
        ));
      }
      return;
    }

    const overItem = milestones.find((m) => m.id === overId);
    if (!overItem) return;

    if (activeItem.status === overItem.status) {
      setMilestones((prev) => {
        const ai = prev.findIndex((m) => m.id === activeId);
        const oi = prev.findIndex((m) => m.id === overId);
        return ai === oi ? prev : arrayMove(prev, ai, oi);
      });
    } else {
      const newStatus = overItem.status;
      setMilestones((prev) => {
        const updated = prev.map((m) =>
          m.id === activeId
            ? { ...m, status: newStatus, isOverdue: false, isBlocked: newStatus === "blocked", isCompleted: newStatus === "completed" }
            : m
        );
        return arrayMove(updated, updated.findIndex((m) => m.id === activeId), updated.findIndex((m) => m.id === overId));
      });
    }
  };
  const dragStartStatus = useRef<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const milestone = milestones.find((m) => m.id === event.active.id);
    setActiveMilestone(milestone || null);
    dragStartStatus.current = milestone?.status ?? null;  // ← save original status
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveMilestone(null);
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const isOverColumn = columns.some((col) => col.id === overId);

    // Final status after drop
    const newStatus = isOverColumn
      ? (overId as Status)
      : milestones.find((m) => m.id === overId)?.status;

    if (isOverColumn) {
      setMilestones((prev) =>
        prev.map((m) =>
          m.id === activeId
            ? { ...m, status: newStatus, isOverdue: false, isBlocked: newStatus === "blocked", isCompleted: newStatus === "completed" }
            : m
        )
      );
    }

    // Only call API if status actually changed from drag start
    if (newStatus && newStatus !== dragStartStatus.current) {
      updateMilestoneStatus(activeId, newStatus);
    }

    dragStartStatus.current = null;  // ← reset
  };


  const updateMilestoneStatus = async (id: string, status: string) => {
            try {
    
                const response = await axiosJWT.post(
                    `${apiUrl}/timesheet/updateStatus`,
                    {
                        idSubTask: id,
                        status: status
                    }
                );
                if (response) {
                    const message = response?.data?.message || "Successfully UpdateStatus"
                    toast.success(message);
                }
    
            } catch (err) {
                const message =
                    err?.response?.data?.message ||
                    "Failed to create group. Please try again.";
    
                toast.error(message);
            }
  };

  return (
    <div>
      <DndContext sensors={sensors} collisionDetection={closestCorners}
        onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
        <div className="d-flex gap-1 overflow-auto">
          {columns.map((column) => (
            <KanbanColumn key={column.id} column={column} milestones={getMilestonesForColumn(column.id)} idTimesheet={idTimesheet} mentionUser={mentionUser}/>
          ))}
        </div>
        <DragOverlay dropAnimation={{ duration: 150, easing: "ease" }}>
          {activeMilestone ? (
            <div style={{ transform: "rotate(1deg) scale(1.03)", opacity: 0.95 }}>
              <MilestoneCard milestone={activeMilestone} isDragging />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      <style>{`
      .col-time-custom {background: #fff; padding: 10px 5px; border: 1px dotted #d3d2d2; border-radius: .375rem;}
      .custom-a-box-g .sb-avatar {margin-left: -8px;}
      .drag-box:hover{background-color:#f5f5f5db !important}
      .custom-a-box-g .sb-avatar:first-child { margin-left: 0;}`}</style>
    </div>
  );
}