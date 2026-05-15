"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

export interface ComboboxProps {
  name: string;
  options: readonly string[];
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  /** Cap on rendered options (defaults 200). Bigger = slower. */
  renderCap?: number;
}

export function Combobox({
  name,
  options,
  defaultValue = "",
  placeholder,
  required,
  className = "",
  renderCap = 200,
}: ComboboxProps) {
  const [value, setValue] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const listId = useId();

  const filtered = useMemo(() => {
    const q = value.trim().toLowerCase();
    const all = q
      ? options.filter((o) => o.toLowerCase().includes(q))
      : options;
    return all.slice(0, renderCap);
  }, [options, value, renderCap]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  function pick(option: string) {
    setValue(option);
    setOpen(false);
    inputRef.current?.focus();
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      if (!open) setOpen(true);
      else setActive((i) => Math.min(i + 1, filtered.length - 1));
      e.preventDefault();
    } else if (e.key === "ArrowUp") {
      setActive((i) => Math.max(i - 1, 0));
      e.preventDefault();
    } else if (e.key === "Enter") {
      if (open && filtered[active]) {
        e.preventDefault();
        pick(filtered[active]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      <input
        ref={inputRef}
        name={name}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setOpen(true);
          setActive(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        required={required}
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 pr-9 text-sm text-foreground shadow-xs placeholder:text-muted-foreground hover:border-foreground/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => {
          setOpen((o) => !o);
          inputRef.current?.focus();
        }}
        className="absolute right-1 top-1/2 -translate-y-1/2 rounded p-1.5 text-muted-foreground hover:text-foreground"
        aria-label="Toggle list"
      >
        <ChevronDown className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-[1000] mt-1 max-h-64 overflow-y-auto overscroll-contain rounded-lg border border-border bg-popover py-1 text-sm shadow-lg"
        >
          {filtered.length === 0 && (
            <li className="px-3 py-2 text-xs text-muted-foreground">No matches</li>
          )}
          {filtered.map((o, i) => {
            const on = i === active;
            return (
              <li
                key={o}
                data-idx={i}
                role="option"
                aria-selected={on}
                onMouseDown={(e) => {
                  e.preventDefault();
                  pick(o);
                }}
                onMouseEnter={() => setActive(i)}
                className={`cursor-pointer px-3 py-1.5 ${
                  on ? "bg-muted text-foreground" : "text-foreground/90"
                }`}
              >
                {o}
              </li>
            );
          })}
          {filtered.length === renderCap && (
            <li className="px-3 py-1.5 text-[11px] italic text-muted-foreground">
              Showing first {renderCap} — keep typing to narrow
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
