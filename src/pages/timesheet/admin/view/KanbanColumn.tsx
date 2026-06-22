"use client";
import { useState} from 'react';
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import MilestoneCard from "./MilestoneCard";
import TimesheetCommentAdd from "./timesheetCommentwithadd.jsx";

export default function KanbanColumn({ column, milestones, mentionUser }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

      const [isModalOpen, setIsModalOpen] = useState(false);
      const [isSubTaskValue, setIsSubTaskValue] = useState({});
      const openCommentModal = async (value) => {
          setIsSubTaskValue(value?.id)
          setIsModalOpen(true)
      }
      const closeCommentModal = async () => {
          setIsSubTaskValue("")
          setIsModalOpen(false)
      }
  return (
    <>
    <TimesheetCommentAdd isOpen={isModalOpen} closeModal={closeCommentModal} SubTaskInfo={isSubTaskValue} mentionUser={mentionUser}/>
    <div className="col-time-custom" style={{ minWidth: 225, maxWidth: 320, flex: 1 }}>
      {/* Column header */}
      <div className="d-flex align-items-center justify-content-between mb-2 px-1">
        <div className="d-flex align-items-center gap-2">
          <div className="rounded-circle" style={{ width: 8, height: 8, backgroundColor: column.dotColor }} />
          <span className="fw-semibold" style={{ fontSize: 13, color: "#000000", textTransform:'uppercase' }}>{column.title}</span>
        </div>
        <span style={{ fontSize: 11, color: "#000", backgroundColor: "#f5f5f5", borderRadius: 25, padding: "3px 8px", fontWeight:700 }}>
          {milestones.length}
        </span>
      </div>

      {/* Drop zone */}
      <div ref={setNodeRef} style={{
        display: "flex", flexDirection: "column", gap: 5, flex: 1,
        borderRadius: '.375rem', padding: 0, minHeight: 120,
        border: isOver ? "1.5px dashed #3b82f6" : "1.5px dashed transparent",
        backgroundColor: isOver ? "rgba(13,31,60,0.6)" : "transparent",
        transition: "all 0.15s",
      }}>
        <SortableContext items={milestones.map((m) => m.id)} strategy={verticalListSortingStrategy}>
          {milestones.map((milestone) => (
            <MilestoneCard key={milestone.id} milestone={milestone} onOpenModal={openCommentModal} isDragging={undefined}/>
          ))}
        </SortableContext>

      </div>
    </div>
    </>
  );
}