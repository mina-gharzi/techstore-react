import { useState } from "react";
import { Users, AlertTriangle, ShieldCheck, ShieldOff, Trash2 } from "lucide-react";

export default function AdminUsersTab({ users, currentUser, deleteUser, setUserRole }) {
  const [userActionError, setUserActionError] = useState("");

  const handleDeleteUser = async (u) => {
    if (currentUser && u.id === currentUser.id) return;
    if (!window.confirm(`آیا از حذف کاربر «${u.fullName}» مطمئنید؟`)) return;
    try {
      setUserActionError("");
      await deleteUser(u.id);
    } catch (err) {
      setUserActionError(err?.message || "خطا در حذف کاربر");
    }
  };

  const handleToggleRole = async (u) => {
    if (currentUser && u.id === currentUser.id) return;
    try {
      setUserActionError("");
      const newRole = u.role === "admin" ? "customer" : "admin";
      await setUserRole(u.id, newRole);
    } catch (err) {
      setUserActionError(err?.message || "خطا در تغییر نقش کاربر");
    }
  };

  return (
    <>
      {userActionError && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "var(--color-error-light)",
            border: "1px solid var(--color-error-border)",
            color: "var(--color-error)",
            borderRadius: "12px",
            padding: "12px 16px",
            fontSize: "0.88rem",
            fontWeight: 600,
            marginBottom: "18px",
          }}
        >
          <AlertTriangle size={16} />
          {userActionError}
        </div>
      )}

      {users.length === 0 ? (
        <div
          style={{
            background: "var(--color-bg-white)",
            border: "1px solid var(--color-border)",
            borderRadius: "18px",
            padding: "60px 20px",
            textAlign: "center",
          }}
        >
          <Users
            size={48}
            color="var(--color-text-faint)"
            style={{ margin: "0 auto 16px" }}
          />
          <p style={{ color: "var(--color-text-muted)" }}>
            هنوز کاربری ثبت‌نام نکرده است.
          </p>
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
          }}
        >
          {users.map((u) => {
            const isSelf = currentUser && u.id === currentUser.id;
            const isAdminUser = u.role === "admin";

            return (
              <div
                key={u.id}
                style={{
                  background: "var(--color-bg-white)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "14px",
                  padding: "14px 16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: isAdminUser
                      ? "linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))"
                      : "var(--color-border)",
                    color: isAdminUser ? "var(--color-bg-white)" : "var(--color-text-muted)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    flexShrink: 0,
                  }}
                >
                  {u.fullName?.charAt(0) || "?"}
                </div>

                <div style={{ flex: 1, minWidth: "180px" }}>
                  <div
                    style={{
                      fontWeight: 700,
                      color: "var(--color-text)",
                      fontSize: "0.95rem",
                    }}
                  >
                    {u.fullName}
                    {isSelf && (
                      <span
                        style={{
                          color: "var(--color-text-faint)",
                          fontWeight: 600,
                          fontSize: "0.78rem",
                        }}
                      >
                        {" "}
                        (خودتان)
                      </span>
                    )}
                  </div>
                  <div style={{ color: "var(--color-text-faint)", fontSize: "0.82rem" }}>
                    {u.email} · {u.phone}
                  </div>
                </div>

                <span
                  style={{
                    background: isAdminUser ? "var(--color-primary-light)" : "#f1f5f9",
                    color: isAdminUser ? "var(--color-primary)" : "var(--color-text-muted)",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    padding: "4px 12px",
                    borderRadius: "50px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {isAdminUser ? "ادمین" : "کاربر عادی"}
                </span>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => handleToggleRole(u)}
                    disabled={isSelf}
                    title={
                      isAdminUser
                        ? "تبدیل به کاربر عادی"
                        : "تبدیل به ادمین"
                    }
                    style={{
                      width: "38px",
                      height: "38px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "10px",
                      border: "1px solid var(--color-border)",
                      color: isSelf ? "#cbd5e1" : "var(--color-primary)",
                      cursor: isSelf ? "not-allowed" : "pointer",
                      background: "var(--color-bg-white)",
                    }}
                  >
                    {isAdminUser ? (
                      <ShieldOff size={16} />
                    ) : (
                      <ShieldCheck size={16} />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteUser(u)}
                    disabled={isSelf}
                    title="حذف کاربر"
                    style={{
                      width: "38px",
                      height: "38px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "10px",
                      border: "1px solid var(--color-error-border)",
                      color: isSelf ? "#fca5a5" : "var(--color-error)",
                      cursor: isSelf ? "not-allowed" : "pointer",
                      background: "var(--color-bg-white)",
                      opacity: isSelf ? 0.6 : 1,
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
