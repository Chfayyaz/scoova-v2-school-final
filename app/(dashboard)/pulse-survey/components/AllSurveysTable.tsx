"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Survey } from "../data";
import { MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Button from "@/components/ui/Button";
import ActionDropdown from "@/components/ui/ActionDropdown";
import Skeleton from "@/components/ui/Skeleton";
import Pagination from "@/app/utils/Pagination";
import { getMySurveysApi, deleteSurveyApi, type MySurveyItem } from "@/lib/api/survey.api";

function mapApiSurveyToSurvey(item: MySurveyItem): Survey {
  const sentDate = item.publishedAt
    ? new Date(item.publishedAt).toISOString().split("T")[0]
    : null;
  return {
    id: item.id,
    title: item.title,
    targetGroup: item.category,
    status: item.status,
    sentDate,
    responses: item.totalResponses ?? 0,
    totalRecipients: item.totalRecipients ?? 0,
  };
}

type AllSurveysTableProps = {
  /** Optional initial surveys; if not provided, fetches from API */
  surveys?: Survey[];
  /** Callback when data is refreshed (e.g. after publish) */
  onRefresh?: () => void;
};

export default function AllSurveysTable({ surveys: initialSurveys, onRefresh }: AllSurveysTableProps) {
  const router = useRouter();
  const pageSize = 20;
  const [allSurveys, setAllSurveys] = useState<Survey[]>(initialSurveys ?? []);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(!initialSurveys?.length);
  const [deletingId, setDeletingId] = useState<Survey["id"] | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{
    id: Survey["id"];
    title: string;
  } | null>(null);
  const fetchSurveys = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMySurveysApi({ page: 1, limit: 500 });
      const mapped = data.surveys.map(mapApiSurveyToSurvey);
      setAllSurveys(mapped);
      setCurrentPage(1);
      onRefresh?.();
    } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to fetch surveys.", {
          id: "fetch-surveys-error",
        });
      if (initialSurveys?.length) {
        setAllSurveys(initialSurveys);
        setCurrentPage(1);
      }
    } finally {
      setLoading(false);
    }
  }, [initialSurveys, onRefresh]);

  useEffect(() => {
    fetchSurveys();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalSurveys = allSurveys.length;
  const totalPages = Math.max(1, Math.ceil(totalSurveys / pageSize));
  const pagedSurveys = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return allSurveys.slice(start, start + pageSize);
  }, [allSurveys, currentPage]);

  const getStatusColor = (status: Survey["status"]) => {
    switch (status) {
      case "active":
        return "bg-custom-green/20 text-[#166534]";
      case "ended":
        return "bg-custom-gray/10 text-custom-gray/70";
      case "draft":
        return "bg-custom-yellow/20 text-[#854D0E]";
      default:
        return "bg-custom-gray/10 text-custom-gray/70";
    }
  };

  const getStatusText = (status: Survey["status"]) => {
    switch (status) {
      case "active":
        return "Active";
      case "ended":
        return "Ended";
      case "draft":
        return "Draft";
      default:
        return status;
    }
  };

  const handleDelete = async (surveyId: Survey["id"]) => {
    const id = String(surveyId);
    if (deletingId) return;
    setDeletingId(surveyId);
    try {
      await deleteSurveyApi(id);
      setAllSurveys((prev) => {
        const next = prev.filter((s) => String(s.id) !== id);
        const nextTotalPages = Math.max(1, Math.ceil(next.length / pageSize));
        setCurrentPage((cp) => Math.min(cp, nextTotalPages));
        return next;
      });
      toast.success("Survey deleted successfully.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete survey.", {
        id: "delete-survey-error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="bg-custom-white rounded-lg border border-custom-gray/10 shadow-sm py-3">
      <div className="px-6 mt-4 pb-4 flex items-center justify-between">
        <h3 className="text-base font-bold text-custom-gray/95">All Surveys</h3>
        {!loading && (
          <span className="text-sm text-custom-gray/70">
            Page {currentPage} of {totalPages} ({totalSurveys} total)
          </span>
        )}
      </div>
      {loading ? (
        <div className="px-6 py-12 text-center text-custom-gray/70 text-sm">
          <div className="flex flex-col items-center justify-center gap-3">
            <Skeleton className="h-4 w-28 rounded-md" />
          </div>
          <div className="mt-6 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-10 w-2/5 rounded-md" />
                <Skeleton className="h-10 w-1/5 rounded-md" />
                <Skeleton className="h-10 w-1/5 rounded-md" />
                <Skeleton className="h-10 w-1/5 rounded-md" />
              </div>
            ))}
          </div>
        </div>
      ) : (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-custom-gray/10">
              <th className="text-center text-xs font-semibold px-6 text-custom-gray/95 py-3 border-t border-custom-gray/10 bg-custom-gray/5 whitespace-nowrap md:whitespace-normal">
                Survey Title
              </th>
              <th className="text-center text-xs font-semibold px-6 text-custom-gray/95 py-3 border-t border-custom-gray/10 bg-custom-gray/5 whitespace-nowrap md:whitespace-normal">
                Target Group
              </th>
              <th className="text-center text-xs font-semibold px-8 text-custom-gray/95 py-3 border-t border-custom-gray/10 bg-custom-gray/5 whitespace-nowrap md:whitespace-normal">
                Status
              </th>
              <th className="text-center text-xs font-semibold px-6 text-custom-gray/95 py-3 border-t border-custom-gray/10 bg-custom-gray/5 whitespace-nowrap md:whitespace-normal">
                Sent Date
              </th>
              <th className="text-center text-xs font-semibold px-6 text-custom-gray/95 py-3 border-t border-custom-gray/10 bg-custom-gray/5 whitespace-nowrap md:whitespace-normal">
                Responses
              </th>
              <th className="text-center text-xs font-semibold px-6 text-custom-gray/95 py-3 border-t border-custom-gray/10 bg-custom-gray/5 whitespace-nowrap md:whitespace-normal">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {pagedSurveys.map((survey) => (
              <tr
                key={survey.id}
                className="border-b border-custom-gray/10 last:border-0"
              >
                <td className="py-2 px-6 text-sm text-custom-gray/95 font-semibold bg-transparent text-center whitespace-nowrap md:whitespace-normal">
                  {survey.title}
                </td>
                <td className="py-2 px-6 text-sm text-custom-gray/80 bg-transparent text-center whitespace-nowrap md:whitespace-normal">
                  {survey.targetGroup}
                </td>
                <td className="py-2 px-6 bg-transparent align-middle text-center whitespace-nowrap md:whitespace-normal">
                  <span
                    className={`inline-block px-3 py-1 font-semibold rounded-full text-xs font-medium leading-none ${getStatusColor(
                      survey.status
                    )}`}
                  >
                    {getStatusText(survey.status)}
                  </span>
                </td>
                <td className="py-2 px-6 text-sm text-custom-gray/80 bg-transparent text-center whitespace-nowrap md:whitespace-normal">
                  {survey.sentDate || "-"}
                </td>
                <td className="py-2 px-6 text-sm text-custom-gray/80 bg-transparent text-center whitespace-nowrap md:whitespace-normal">
                  {survey.responses} / {survey.totalRecipients}
                </td>
                <td className="py-2 px-6 bg-transparent text-center">
                  <ActionDropdown
                    trigger={<MoreVertical size={18} className="text-custom-gray/60" />}
                    actions={[
                      {
                        label: "View",
                        onClick: () => {
                          router.push(`/pulse-survey/details/${survey.id}`);
                        },
                      },
                      {
                        label: "Edit",
                        onClick: () => {
                          if (survey.status !== "draft") {
                            toast.error("Only draft surveys can be edited.");
                            return;
                          }
                          router.push(`/pulse-survey/generate?surveyId=${survey.id}`);
                        },
                      },
                      {
                        label: deletingId === survey.id ? "Deleting…" : "Delete",
                        onClick: () =>
                          setPendingDelete({ id: survey.id, title: survey.title }),
                        variant: "danger",
                      },
                    ]}
                    align="right"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}
      {!loading && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-custom-gray/10">
          <Pagination
            totalRecords={totalSurveys}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={(nextPage) => {
              setCurrentPage(nextPage);
            }}
          />
        </div>
      )}

      {pendingDelete && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-survey-dialog-title"
          aria-describedby="delete-survey-dialog-desc"
          onClick={() => setPendingDelete(null)}
        >
          <div
            className="bg-custom-white rounded-lg border border-custom-gray/10 shadow-lg max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              id="delete-survey-dialog-title"
              className="text-lg font-semibold text-custom-gray/95 mb-2"
            >
              Delete survey?
            </h3>
            <p
              id="delete-survey-dialog-desc"
              className="text-sm text-custom-gray/70 mb-6"
            >
              Are you sure you want to delete &quot;{pendingDelete.title}&quot;? This
              cannot be undone.
            </p>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
              <Button
                type="button"
                variant="filled"
                rounded="full"
                bgColor="bg-custom-teal"
                hoverBgColor="hover:bg-custom-teal/90"
                textColor="text-custom-white"
                onClick={() => setPendingDelete(null)}
                className="text-sm px-5 py-2"
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="filled"
                rounded="full"
                bgColor="bg-red-600"
                hoverBgColor="hover:bg-red-700"
                textColor="text-custom-white"
                onClick={() => {
                  const { id } = pendingDelete;
                  setPendingDelete(null);
                  void handleDelete(id);
                }}
                className="text-sm px-5 py-2"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
