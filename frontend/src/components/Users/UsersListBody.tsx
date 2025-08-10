import React, { useCallback, useState } from "react";
import dayjs from "dayjs";

import type { User } from "@/interfaces/user";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { Edit3 } from "lucide-react";
import { Badge } from "../ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import UserForm from "./UserForm";
import type { UserFormValues } from "@/schemas/user";
import { useUpdateUser } from "@/hooks/useUserMutation";
import { cn } from "@/lib/utils";

interface UserListProps {
  users: User[];
}

const UserListContent: React.FC<UserListProps> = ({ users }) => {
  const [editUser, setEditUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { mutate: updateTaskMutation, isPending } = useUpdateUser();

  const handleEditTask = useCallback((task: User) => {
    setEditUser(task);
    setIsEditModalOpen(true);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditUser(null);
    setIsEditModalOpen(false);
  }, []);

  const handleEditSubmit = useCallback(
    (values: UserFormValues) => {
      updateTaskMutation(
        { id: editUser?.id as number, userData: values },
        {
          onSuccess: () => {
            setIsEditModalOpen(false);
            setEditUser(null);
          },
        }
      );
    },
    [editUser, updateTaskMutation]
  );

  return (
    <>
      <ScrollArea className="min-h-36 max-h-72 whitespace-nowrap">
        <ul className="mt-4 space-y-3.5 max-h-72 overflow-y-auto">
          {users.map((user) => (
            <li key={user.id} className="flex justify-between items-center">
              <div className="flex flex-col gap-1">
                <div className="flex gap-2 items-center">
                  <h2
                    className={cn(
                      { "text-muted-foreground": !user.is_active },
                      "text-lg font-medium font-sans first-letter:uppercase"
                    )}
                  >
                    {user.full_name}
                  </h2>
                  <Badge variant="outline" className="text-xs">
                    {user.role}
                  </Badge>
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-xs text-muted-foreground font-mono tracking-tighter">
                    Last access {dayjs(user.last_access).format("YYYY-MM-DD")}
                  </span>
                  {!user.is_active && (
                    <span className="text-xs text-red-500 font-mono tracking-tighter">
                      Inactive
                    </span>
                  )}
                </div>
              </div>
              <div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => handleEditTask(user)}
                >
                  <Edit3 />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </ScrollArea>
      <Dialog open={isEditModalOpen} onOpenChange={handleCloseEditModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <UserForm
            defaultValues={{
              full_name: editUser?.full_name || "",
              role: editUser?.role || undefined,
              is_active: editUser?.is_active || undefined,
            }}
            isPending={isPending}
            onSubmit={handleEditSubmit}
            // isPending={isUpdating}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserListContent;
