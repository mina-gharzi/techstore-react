import { MessageSquare, Star, BadgeCheck, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function ProductReviews({
  productReviews,
  ratingInfo,
  myReview,
  hasPurchased,
  reviewRating,
  setReviewRating,
  hoveredStar,
  setHoveredStar,
  reviewComment,
  setReviewComment,
  reviewSaved,
  reviewError,
  handleReviewSubmit,
  handleDeleteReview,
  isAuthenticated,
  user,
  location,
}) {
  return (
    <div
      style={{
        background: "var(--color-bg-white)",
        border: "1px solid var(--color-border)",
        borderRadius: "20px",
        padding: "28px 24px",
        marginBottom: "50px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "24px",
        }}
      >
        <MessageSquare size={20} color="var(--color-primary)" />
        <h2
          style={{
            fontSize: "1.3rem",
            fontWeight: 800,
            color: "var(--color-text)",
          }}
        >
          نظرات کاربران
          {ratingInfo.count > 0 && (
            <span
              style={{
                color: "var(--color-text-faint)",
                fontWeight: 600,
                fontSize: "0.95rem",
              }}
            >
              {" "}
              ({ratingInfo.count})
            </span>
          )}
        </h2>
      </div>

      {/* ---------- فرم ثبت/ویرایش نظر ---------- */}
      {isAuthenticated ? (
        <form
          onSubmit={handleReviewSubmit}
          style={{
            background: "var(--color-bg)",
            border: "1px solid var(--color-border)",
            borderRadius: "16px",
            padding: "20px",
            marginBottom: "28px",
          }}
        >
          <div style={{ marginBottom: "14px" }}>
            <span
              style={{
                display: "block",
                fontWeight: 700,
                color: "var(--color-text-secondary)",
                marginBottom: "8px",
                fontSize: "0.92rem",
              }}
            >
              {myReview ? "ویرایش امتیاز شما" : "امتیاز شما"}
            </span>
            <div style={{ display: "flex", gap: "4px" }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    setReviewRating(star);
                    setReviewError("");
                  }}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  style={{ cursor: "pointer", padding: "2px" }}
                  aria-label={`امتیاز ${star} از ۵`}
                >
                  <Star
                    size={26}
                    color="var(--color-warning)"
                    fill={
                      star <= (hoveredStar || reviewRating)
                        ? "var(--color-warning)"
                        : "none"
                    }
                  />
                </button>
              ))}
            </div>
            {reviewError && (
              <span
                style={{
                  display: "block",
                  marginTop: "8px",
                  color: "var(--color-error)",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                }}
              >
                {reviewError}
              </span>
            )}
          </div>

          <div style={{ marginBottom: "14px" }}>
            <textarea
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="نظر خود را درباره این محصول بنویسید (اختیاری)..."
              rows={3}
              style={{
                width: "100%",
                padding: "12px 14px",
                border: "1.5px solid var(--color-border)",
                borderRadius: "12px",
                fontSize: "0.92rem",
                outline: "none",
                background: "var(--color-bg-white)",
                fontFamily: "inherit",
                color: "var(--color-text)",
                resize: "vertical",
                lineHeight: 1.7,
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
            }}
          >
            <button
              type="submit"
              style={{
                padding: "11px 26px",
                background: reviewSaved ? "var(--color-success)" : "var(--color-primary)",
                color: "var(--color-bg-white)",
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "0.9rem",
                border: "none",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {reviewSaved
                ? "ثبت شد ✓"
                : myReview
                  ? "ذخیره ویرایش"
                  : "ثبت نظر"}
            </button>

            {myReview && (
              <button
                type="button"
                onClick={handleDeleteReview}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: "var(--color-error)",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                <Trash2 size={14} />
                حذف نظر من
              </button>
            )}
          </div>
        </form>
      ) : (
        <div
          style={{
            background: "var(--color-bg)",
            border: "1px solid var(--color-border)",
            borderRadius: "16px",
            padding: "18px 20px",
            marginBottom: "28px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "var(--color-text-muted)",
              marginBottom: "12px",
              fontSize: "0.9rem",
            }}
          >
            برای ثبت نظر و امتیاز، ابتدا وارد حساب کاربری خود شوید.
          </p>
          <Link
            to="/login"
            state={{ from: location.pathname }}
            style={{
              display: "inline-block",
              padding: "9px 22px",
              background: "var(--color-primary)",
              color: "var(--color-bg-white)",
              borderRadius: "10px",
              fontWeight: 700,
              fontSize: "0.85rem",
              textDecoration: "none",
            }}
          >
            ورود به حساب
          </Link>
        </div>
      )}

      {/* ---------- لیست نظرها ---------- */}
      {productReviews.length === 0 ? (
        <p
          style={{
            color: "var(--color-text-faint)",
            textAlign: "center",
            padding: "20px 0",
            fontSize: "0.9rem",
          }}
        >
          هنوز نظری برای این محصول ثبت نشده - اولین نفر باشید!
        </p>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {productReviews.map((review) => (
            <div
              key={review.id}
              style={{
                paddingBottom: "16px",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "10px",
                  marginBottom: "8px",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      background: "var(--color-primary-light)",
                      color: "var(--color-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 800,
                      fontSize: "0.85rem",
                      flexShrink: 0,
                    }}
                  >
                    {review.userName?.charAt(0) || "?"}
                  </div>
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <span
                        style={{
                          fontWeight: 700,
                          color: "var(--color-text)",
                          fontSize: "0.88rem",
                        }}
                      >
                        {review.userName}
                      </span>
                      {hasPurchased && review.userId === user?.id && (
                        <span
                          title="خریدار تایید شده"
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "3px",
                            color: "var(--color-success)",
                            fontSize: "0.72rem",
                            fontWeight: 700,
                          }}
                        >
                          <BadgeCheck size={13} />
                          خریدار
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "1px",
                        marginTop: "2px",
                      }}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={13}
                          color="var(--color-warning)"
                          fill={
                            star <= review.rating ? "var(--color-warning)" : "none"
                          }
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <span
                  style={{
                    color: "var(--color-text-faint)",
                    fontSize: "0.78rem",
                    whiteSpace: "nowrap",
                  }}
                >
                  {new Date(review.createdAt).toLocaleDateString(
                    "fa-IR",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </span>
              </div>

              {review.comment && (
                <p
                  style={{
                    color: "#475569",
                    fontSize: "0.9rem",
                    lineHeight: 1.8,
                    marginRight: "42px",
                  }}
                >
                  {review.comment}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
