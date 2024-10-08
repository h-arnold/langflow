import { Textarea } from "@/components/ui/textarea";
import useFlowsManagerStore from "@/stores/flowsManagerStore";
import useFlowStore from "@/stores/flowStore";
import { handleKeyDown } from "@/utils/reactflowUtils";
import { cn } from "@/utils/utils";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";

export default function NodeDescription({
  description,
  selected,
  nodeId,
  emptyPlaceholder = "Double Click to Edit Description",
  charLimit,
  inputClassName,
  mdClassName,
  style,
}: {
  description?: string;
  selected: boolean;
  nodeId: string;
  emptyPlaceholder?: string;
  charLimit?: number;
  inputClassName?: string;
  mdClassName?: string;
  style?: React.CSSProperties;
}) {
  const [inputDescription, setInputDescription] = useState(false);
  const [nodeDescription, setNodeDescription] = useState(description);
  const takeSnapshot = useFlowsManagerStore((state) => state.takeSnapshot);
  const setNode = useFlowStore((state) => state.setNode);

  useEffect(() => {
    if (!selected) {
      setInputDescription(false);
    }
  }, [selected]);

  useEffect(() => {
    setNodeDescription(description);
  }, [description]);

  return (
    <div
      className={cn(
        "generic-node-desc",
        !inputDescription ? "overflow-auto" : "",
      )}
    >
      {inputDescription ? (
        <>
          <Textarea
            maxLength={charLimit}
            className={cn("nowheel h-full", inputClassName)}
            autoFocus
            style={style}
            onBlur={() => {
              setInputDescription(false);
              setNodeDescription(nodeDescription);
              setNode(nodeId, (old) => ({
                ...old,
                data: {
                  ...old.data,
                  node: {
                    ...old.data.node,
                    description: nodeDescription,
                  },
                },
              }));
            }}
            value={nodeDescription}
            onChange={(e) => setNodeDescription(e.target.value)}
            onKeyDown={(e) => {
              handleKeyDown(e, nodeDescription, "");
              if (
                e.key === "Enter" &&
                e.shiftKey === false &&
                e.ctrlKey === false &&
                e.altKey === false
              ) {
                setInputDescription(false);
                setNodeDescription(nodeDescription);
                setNode(nodeId, (old) => ({
                  ...old,
                  data: {
                    ...old.data,
                    node: {
                      ...old.data.node,
                      description: nodeDescription,
                    },
                  },
                }));
              }
            }}
          />
          {charLimit && (
            <div
              className={cn(
                "text-left text-xs",
                (nodeDescription?.length ?? 0) >= charLimit
                  ? "text-error"
                  : "text-primary",
              )}
              data-testid="note_char_limit"
            >
              {nodeDescription?.length ?? 0}/{charLimit}
            </div>
          )}
        </>
      ) : (
        <div
          className={cn(
            "nodoubleclick generic-node-desc-text h-full cursor-text word-break-break-word dark:text-note-placeholder",
            description === "" || !description ? "font-light italic" : "",
          )}
          onDoubleClick={(e) => {
            setInputDescription(true);
            takeSnapshot();
          }}
        >
          {description === "" || !description ? (
            emptyPlaceholder
          ) : (
            <Markdown
              className={cn(
                "markdown prose flex h-full w-full flex-col text-primary word-break-break-word dark:prose-invert",
                mdClassName,
              )}
            >
              {String(description)}
            </Markdown>
          )}
        </div>
      )}
    </div>
  );
}
