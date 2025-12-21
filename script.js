/* -----------------------------------------------------------
   تحسينات UX فقط — دون التأثير على مصادقة MikroTik
   - إظهار رسالة الخطأ إذا وُجدت.
   - التحقق البسيط للحقول قبل الإرسال.
   - تأثير تحميل على زر "تسجيل الدخول".
   - تبديل إظهار/إخفاء كلمة المرور.
   - نافذة تعليمات الاستخدام.
   - تأثير Ripple للأزرار.
----------------------------------------------------------- */

(function () {
  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // 1) إظهار الخطأ (login.html)
  const errorBox = qs("#error-box");
  if (errorBox) {
    // إذا كان النص الناتج من MikroTik غير فارغ، أظهر الصندوق
    const txt = (errorBox.textContent || "").trim();
    if (txt && !txt.includes("$(")) { // يتأكد أن المتغير استبدل فعلاً
      errorBox.style.display = "block";
    }
  }

  // 2) نموذج تسجيل الدخول — تحقق بسيط وإظهار التحميل
  const loginForm = qs("#login-form");
  const loginBtn = qs("#login-btn");

  if (loginForm && loginBtn) {
    loginForm.addEventListener("submit", function (e) {
      const user = qs("#username");
      const pass = qs("#password");

      // تحقق أولي
      if (!user.value.trim() || !pass.value.trim()) {
        e.preventDefault();
        showInlineError("يرجى إدخال اسم المستخدم وكلمة المرور.");
        pulse(user);
        pulse(pass);
        return;
      }

      // تأثير تحميل
      loginBtn.classList.add("loading");
      loginBtn.disabled = true;

      // تجربة مستخدم: منع النقرات المتكررة لبضع ثوانٍ
      setTimeout(() => {
        loginBtn.disabled = false;
        loginBtn.classList.remove("loading");
      }, 6000);
      // ملاحظة: لن يؤثر ذلك على إرسال النموذج الذي يديره MikroTik
    });
  }

  // 3) تبديل إظهار/إخفاء كلمة المرور
  const togglePass = qs(".toggle-pass");
  const passInput = qs("#password");
  if (togglePass && passInput) {
    togglePass.addEventListener("click", () => {
      const isText = passInput.type === "text";
      passInput.type = isText ? "password" : "text";
      pulse(passInput);
    });
  }

  // 4) نافذة تعليمات الاستخدام
  const helpLink = qs("#usage-help");
  const helpModal = qs("#help-modal");
  const closeHelp = qs("#close-help");

  if (helpLink && helpModal && closeHelp) {
    helpLink.addEventListener("click", (e) => {
      e.preventDefault();
      helpModal.setAttribute("aria-hidden", "false");
    });
    closeHelp.addEventListener("click", () => {
      helpModal.setAttribute("aria-hidden", "true");
    });
    qs(".modal-backdrop", helpModal)?.addEventListener("click", () => {
      helpModal.setAttribute("aria-hidden", "true");
    });
  }

  // 5) Ripple للأزرار
  qsa(".btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      this.classList.add("ripple-animate");
      setTimeout(() => this.classList.remove("ripple-animate"), 600);
    });
  });

  // أدوات مساعدة صغيرة
  function showInlineError(msg) {
    if (!errorBox) return;
    errorBox.textContent = msg;
    errorBox.style.display = "block";
  }
  function pulse(el) {
    if (!el) return;
    el.style.transform = "translateY(-1px) scale(1.01)";
    setTimeout(() => (el.style.transform = ""), 160);
  }
})();
