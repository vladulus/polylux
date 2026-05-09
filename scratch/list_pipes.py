"""List Windows named pipes, filter for ASUS-related ones."""
import os

PIPE_DIR = "\\\\.\\pipe\\"

pipes = sorted(os.listdir(PIPE_DIR))
keywords = ["asus", "aura", "armoury", "lighting", "matrix", "aac", "aio",
            "sdk", "rgb", "anime", "rog", "framework"]

print(f"total pipes on system: {len(pipes)}")
print()
print("ASUS-related pipes:")
for p in pipes:
    if any(k in p.lower() for k in keywords):
        print(f"  \\\\.\\pipe\\{p}")
print()
print("All pipes (for context):")
for p in pipes[:80]:
    print(f"  {p}")
