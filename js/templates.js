// Mailchimp endpoints (yours)
const ACTION   = "https://cuerporaizbreathwork.us8.list-manage.com/subscribe/post?u=da01e192b9e5c7e47f1697a1b&id=415cc74907&f_id=00810fe1f0";
const HONEYPOT = "b_da01e192b9e5c7e47f1697a1b_415cc74907";

// A single, styled embedded form. Hidden by default; we unhide only when needed.
export const fallbackHTML = `
  <div id="fallback" class="hidden">
    <div class="card">
      <div class="card-body">
        <div class="slab">
          <form action="${ACTION}" method="post" target="_self" novalidate>
            <div class="mc-field">
              <label class="lab" for="mce-EMAIL">Tu email</label>
              <input class="input" type="email" name="EMAIL" id="mce-EMAIL" required autocomplete="email" />
            </div>
            <div aria-hidden="true" style="position:absolute; left:-5000px;">
              <input type="text" name="${HONEYPOT}" tabindex="-1" value="">
            </div>
            <button class="cta" type="submit">Participar</button>
            <p class="muted">Revisá tu bandeja (y spam) tras enviar.</p>
          </form>
        </div>
      </div>
    </div>
  </div>
`;
