"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  Circle,
  CircleAlert,
  CircleDotDashed,
  CircleX,
} from "lucide-react";
import { motion, AnimatePresence, LayoutGroup, type Variants } from "framer-motion";
import { cn } from "@/lib/utils";

// Type definitions
interface Subtask {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  tools?: string[]; // Optional array of MCP server tools
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  level: number;
  dependencies: string[];
  subtasks: Subtask[];
}

// Initial task data (Example for VipFlow)
const initialTasks: Task[] = [
  {
    id: "1",
    title: "Fase de Descubrimiento",
    description: "Recolección de requisitos y definición del alcance del proyecto",
    status: "completed",
    priority: "high",
    level: 0,
    dependencies: [],
    subtasks: [
      {
        id: "1.1",
        title: "Entrevistas con el cliente",
        description: "Reuniones iniciales para entender la visión de la marca",
        status: "completed",
        priority: "high",
        tools: ["zoom-agent", "calendar-sync"],
      },
      {
        id: "1.2",
        title: "Análisis de competencia",
        description: "Estudio de mercado y referentes visuales",
        status: "completed",
        priority: "medium",
        tools: ["browser-research", "pinterest-api"],
      },
    ],
  },
  {
    id: "2",
    title: "Diseño de Identidad Visual",
    description: "Creación de logotipos, paleta de colores y tipografía",
    status: "in-progress",
    priority: "high",
    level: 0,
    dependencies: ["1"],
    subtasks: [
      {
        id: "2.1",
        title: "Moodboards conceptuales",
        description: "Tres direcciones creativas basadas en el descubrimiento",
        status: "completed",
        priority: "high",
        tools: ["figma-agent", "asset-library"],
      },
      {
        id: "2.2",
        title: "Refinamiento de Logotipo",
        description: "Ajustes finales basados en el feedback del cliente",
        status: "in-progress",
        priority: "high",
        tools: ["illustrator-sync", "feedback-manager"],
      },
      {
        id: "2.3",
        title: "Manual de Marca",
        description: "Documentación de usos correctos y normativas",
        status: "pending",
        priority: "medium",
        tools: ["pdf-generator", "markdown-processor"],
      },
    ],
  },
  {
    id: "3",
    title: "Implementación Web",
    description: "Desarrollo del sitio principal usando la nueva identidad",
    status: "pending",
    priority: "medium",
    level: 1,
    dependencies: ["2"],
    subtasks: [
      {
        id: "3.1",
        title: "Arquitectura de Información",
        description: "Sitemap y wireframes de baja fidelidad",
        status: "pending",
        priority: "high",
        tools: ["sitemap-generator", "wireframe-tool"],
      },
      {
        id: "3.2",
        title: "Desarrollo Frontend",
        description: "Maquetación con Next.js y Tailwind CSS",
        status: "pending",
        priority: "high",
        tools: ["nextjs-agent", "tailwind-builder"],
      },
    ],
  },
];

export function AgentPlan({ tasksData = initialTasks }: { tasksData?: Task[] }) {
  const [tasks, setTasks] = useState<Task[]>(tasksData);
  const [expandedTasks, setExpandedTasks] = useState<string[]>(["2"]);
  const [expandedSubtasks, setExpandedSubtasks] = useState<{
    [key: string]: boolean;
  }>({});
  
  const prefersReducedMotion = 
    typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false;

  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId],
    );
  };

  const toggleSubtaskExpansion = (taskId: string, subtaskId: string) => {
    const key = `${taskId}-${subtaskId}`;
    setExpandedSubtasks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const statuses = ["completed", "in-progress", "pending", "need-help", "failed"];
          const currentIndex = Math.floor(Math.random() * statuses.length);
          const newStatus = statuses[currentIndex];

          const updatedSubtasks = task.subtasks.map((subtask) => ({
            ...subtask,
            status: newStatus === "completed" ? "completed" : subtask.status,
          }));

          return {
            ...task,
            status: newStatus,
            subtasks: updatedSubtasks,
          };
        }
        return task;
      }),
    );
  };

  const toggleSubtaskStatus = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subtasks.map((subtask) => {
            if (subtask.id === subtaskId) {
              const newStatus =
                subtask.status === "completed" ? "pending" : "completed";
              return { ...subtask, status: newStatus };
            }
            return subtask;
          });

          const allSubtasksCompleted = updatedSubtasks.every(
            (s) => s.status === "completed",
          );

          return {
            ...task,
            subtasks: updatedSubtasks,
            status: allSubtasksCompleted ? "completed" : task.status,
          };
        }
        return task;
      }),
    );
  };

  const taskVariants: Variants = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : -5 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: prefersReducedMotion ? "tween" : "spring", 
        stiffness: 500, 
        damping: 30,
        duration: prefersReducedMotion ? 0.2 : undefined
      }
    },
    exit: { opacity: 0, y: prefersReducedMotion ? 0 : -5, transition: { duration: 0.15 } }
  };

  const subtaskListVariants = {
    hidden: { opacity: 0, height: 0, overflow: "hidden" },
    visible: { 
      height: "auto", 
      opacity: 1,
      overflow: "visible",
      transition: { 
        duration: 0.25, 
        staggerChildren: prefersReducedMotion ? 0 : 0.05,
        when: "beforeChildren",
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    },
    exit: {
      height: 0,
      opacity: 0,
      overflow: "hidden",
      transition: { duration: 0.2, ease: [0.2, 0.65, 0.3, 0.9] }
    }
  };

  const subtaskVariants: Variants = {
    hidden: { opacity: 0, x: prefersReducedMotion ? 0 : -10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: prefersReducedMotion ? "tween" : "spring", 
        stiffness: 500, 
        damping: 25,
        duration: prefersReducedMotion ? 0.2 : undefined
      }
    },
    exit: { opacity: 0, x: prefersReducedMotion ? 0 : -10, transition: { duration: 0.15 } }
  };

  const subtaskDetailsVariants = {
    hidden: { opacity: 0, height: 0, overflow: "hidden" },
    visible: { 
      opacity: 1, 
      height: "auto",
      overflow: "visible",
      transition: { duration: 0.25, ease: [0.2, 0.65, 0.3, 0.9] }
    }
  };

  return (
    <div className="bg-[#0a0a0c] text-zinc-100 h-full overflow-auto custom-scrollbar">
      <motion.div 
        className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden"
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: { duration: 0.3, ease: [0.2, 0.65, 0.3, 0.9] }
        }}
      >
        <LayoutGroup>
          <div className="p-6">
            <ul className="space-y-3">
              {tasks.map((task, index) => {
                const isExpanded = expandedTasks.includes(task.id);
                const isCompleted = task.status === "completed";

                return (
                  <motion.li
                    key={task.id}
                    className={cn(index !== 0 ? "mt-2 pt-4 border-t border-white/[0.03]" : "")}
                    initial="hidden"
                    animate="visible"
                    variants={taskVariants}
                  >
                    <motion.div 
                      className="group flex items-center px-4 py-2 rounded-xl transition-colors hover:bg-white/[0.02]"
                    >
                      <motion.div
                        className="mr-3 flex-shrink-0 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskStatus(task.id);
                        }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={task.status}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                          >
                            {task.status === "completed" ? (
                              <CheckCircle2 className="h-5 w-5 text-[#51DD7D]" />
                            ) : task.status === "in-progress" ? (
                              <CircleDotDashed className="h-5 w-5 text-blue-500 animate-spin-slow" />
                            ) : (
                              <Circle className="text-zinc-700 h-5 w-5" />
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </motion.div>

                      <motion.div
                        className="flex min-w-0 flex-grow cursor-pointer items-center justify-between"
                        onClick={() => toggleTaskExpansion(task.id)}
                      >
                        <div className="mr-4 flex-1 truncate">
                          <span
                            className={cn(
                              "font-semibold text-sm transition-all",
                              isCompleted ? "text-zinc-600 line-through" : "text-zinc-100"
                            )}
                          >
                            {task.title}
                          </span>
                        </div>

                        <div className="flex flex-shrink-0 items-center space-x-3">
                          {task.dependencies.length > 0 && (
                            <div className="flex items-center gap-1">
                                {task.dependencies.map((dep, idx) => (
                                  <span key={idx} className="bg-white/5 text-zinc-500 rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest">
                                    Pre: {dep}
                                  </span>
                                ))}
                            </div>
                          )}

                          <span
                            className={cn(
                              "rounded px-2 py-0.5 text-[9px] font-black uppercase tracking-tighter",
                              task.status === "completed" ? "bg-[#51DD7D]/10 text-[#51DD7D]" :
                              task.status === "in-progress" ? "bg-blue-500/10 text-blue-500" :
                              "bg-zinc-800 text-zinc-500"
                            )}
                          >
                            {task.status}
                          </span>
                        </div>
                      </motion.div>
                    </motion.div>

                    <AnimatePresence mode="wait">
                      {isExpanded && task.subtasks.length > 0 && (
                        <motion.div 
                          className="relative mt-2"
                          variants={subtaskListVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          layout
                        >
                          <div className="absolute top-0 bottom-0 left-[26px] border-l border-dashed border-white/10" />
                          <ul className="ml-10 space-y-1 pr-4">
                            {task.subtasks.map((subtask) => {
                              const subtaskKey = `${task.id}-${subtask.id}`;
                              const isSubtaskExpanded = expandedSubtasks[subtaskKey];

                              return (
                                <motion.li
                                  key={subtask.id}
                                  className="group flex flex-col py-1"
                                  variants={subtaskVariants}
                                >
                                  <motion.div 
                                    className="flex flex-1 items-center rounded-lg p-2 hover:bg-white/[0.03] transition-all cursor-pointer"
                                    onClick={() => toggleSubtaskExpansion(task.id, subtask.id)}
                                  >
                                    <div
                                      className="mr-3 flex-shrink-0"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSubtaskStatus(task.id, subtask.id);
                                      }}
                                    >
                                      {subtask.status === "completed" ? (
                                        <CheckCircle2 className="h-4 w-4 text-[#51DD7D]" />
                                      ) : (
                                        <Circle className="text-zinc-800 h-4 w-4" />
                                      )}
                                    </div>

                                    <span
                                      className={cn(
                                        "text-xs transition-all",
                                        subtask.status === "completed" ? "text-zinc-600 line-through" : "text-zinc-300"
                                      )}
                                    >
                                      {subtask.title}
                                    </span>
                                  </motion.div>

                                  <AnimatePresence>
                                    {isSubtaskExpanded && (
                                      <motion.div 
                                        className="mt-1 ml-2 border-l border-dashed border-white/5 pl-6 text-[11px] text-zinc-500 overflow-hidden"
                                        variants={subtaskDetailsVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                      >
                                        <p className="py-2 leading-relaxed">{subtask.description}</p>
                                        {subtask.tools && subtask.tools.length > 0 && (
                                          <div className="mt-1 mb-2 flex flex-wrap items-center gap-2">
                                            <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Tools:</span>
                                            {subtask.tools.map((tool, idx) => (
                                              <span key={idx} className="bg-white/[0.03] text-zinc-400 rounded px-1.5 py-0.5 border border-white/5">
                                                {tool}
                                              </span>
                                            ))}
                                          </div>
                                        )}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.li>
                              );
                            })}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </LayoutGroup>
      </motion.div>
    </div>
  );
}
