"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Avatar from 'react-avatar';

export default function MilestoneCard({ milestone, isDragging, onOpenModal }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: sorting } = useSortable({ id: milestone.id });
const title = milestone.title || "";

const isLongTitle = title.length > 65;
  return (
    <div ref={setNodeRef}
      className="drag-box"
      onClick={() => onOpenModal(milestone)}
      style={{
        transform: CSS.Transform.toString(transform), transition,
        backgroundColor: "#f5f5f561", border: `1px solid ${sorting ? "#e5e4e4" : "#e5e4e4"}`,
        borderRadius: '.375rem', padding: "5px", cursor: "grab",
        opacity: sorting || isDragging ? 0.4 : 1,
        userSelect: "none",
      }}
      {...attributes} {...listeners}
    >
      <h6 style={{
        fontSize: 12, fontWeight: 600, marginBottom: 4,
        color: milestone.isCompleted ? "#4a5568" : milestone?.isBlocked ? "red" : "#64748b",
        textDecoration: milestone.isCompleted ? "line-through" : "none",
      }}>
        {isLongTitle ? (
    <>
      {title.slice(0, 65)}
      <span
        data-tooltip-id={`title-tooltip-${milestone.id}`}
        data-tooltip-content={title}
        style={{ cursor: "pointer" }}
      >
        ...
      </span>
    </>
  ) : (
    title
  )}
      </h6>

      {!milestone.isCompleted && (
        <p style={{
          fontSize: 11, color: "#64748b", lineHeight: 1.5, marginBottom: 10,
          display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden"
        }}
        >
          <span
            dangerouslySetInnerHTML={{
              __html: milestone.description,
            }}
          />
        </p>
      )}

      <div className="d-flex align-items-center justify-content-between">
        <span style={{ fontSize: 11, color: milestone.isOverdue || milestone.isBlocked ? "#f87171" : "#64748b" }}>
          📅 {milestone.date}
          {milestone.isOverdue && " — overdue"}
          {milestone.isBlocked && " — Blocked"}
        </span>
        <div className="d-flex custom-a-box-g" style={{ marginLeft: 8 }}>
          {milestone.assignees.map((a, i) => (
            <Avatar key={i} name={a.initials} size="20" textSizeRatio={2} round src={a.ProfilePic} />
          ))}
        </div>
      </div>
    </div>
  );
}