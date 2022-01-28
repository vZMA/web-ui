<template>
  <footer class="page-footer">
    <div class="wrapper footer_top">
      <div id="footer_text">
        <p>
          This site is not affiliated with the FAA, or any governing aviation
          body. All content contained herein is approved only for use on the
          VATSIM network.
        </p>
        <p>
          This site works best in Google Chrome, Mozilla Firefox, and Microsoft
          Edge.
        </p>
        <p>
          If you are still using Internet Explorer, please consider switching to
          a more modern browser.
        </p>
      </div>
      <img
        src="https://zma-web.nyc3.digitaloceanspaces.com/images/zma_logo.png"
        alt=""
        draggable="false"
        height="70"
        width="70"
      />
    </div>
    <div class="footer_pride">
      <div class="wrapper">
        <div class="footer_flags">
          <div class="lgbt_flag"></div>
          <div class="trans_flag"></div>
          <div class="bi_flag"></div>
        </div>
        <a href="#lgbt_modal" class="modal-trigger">
          The Miami ARTCC stands with the LGBTQIA+ community on VATSIM
        </a>
      </div>
    </div>
    <div class="footer-copyright">
      <div class="wrapper">
        <div class="text-lg font-bold copyright-text">
          Copyright &copy; <span id="full_year"></span> Miami ARTCC
        </div>
        <div class="hide-on-small-only">•</div>
        <div>
          <span ref="zulu_time">{{ footerTime }}</span>
        </div>
        <div class="hide-on-small-only">•</div>
      </div>
    </div>
    <div id="lgbt_modal" class="modal">
      <div class="modal-content">
        <h5>We stand with the LGBTQIA+ community on VATSIM</h5>
        <p>
          Miami ARTCC displays the rainbow, transgender and bisexual flags as a
          show of solidarity with the LGBTQIA+ community on VATSIM. You are
          welcome here, and you have our support.
        </p>
        <p>
          As an organization with LGBTQIA+ members, we recognize the importance
          of creating a welcoming environment to all members. Everyone is
          welcome here, regardless of their race, nationality, national origin,
          ethnicity, ethnic origin, socioeconomic status, religion, age,
          disability, sexual orientation, gender or gender identity.
        </p>
        <p>
          We recognize CZQO, CZWG, ZJX, ZNY, ZOA, ZOB, ZAB and ZSE for displaying
          similar statements on their websites.
        </p>
        <div class="modal_flags">
          <div class="lgbt_flag"></div>
          <div class="trans_flag"></div>
          <div class="bi_flag"></div>
        </div>
      </div>
      <div class="modal-footer">
        <a href="#!" class="btn-flat waves-effect modal-close">Close</a>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  mounted() {
    M.Modal.init(document.querySelectorAll(".modal"), {
      preventScrolling: false,
    });

    this.$nextTick(() => {
      document.getElementById("full_year").innerHTML = new Date().getFullYear();
    });
  },
};
</script>

<style scoped lang="scss">
p {
  margin: 0;

  .bold {
    font-weight: 700;
  }
}

body .page-footer {
  padding: 0;

  .footer-copyright {
    display: block;
    font-size: 0.8rem;

    .wrapper {
      display: flex;

      div {
        margin-right: 0.8em;
      }
    }
  }
}

.wrapper {
  padding: 1em;
}

.footer_top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

#footer_text,
.footer-copyright {
  padding: 0 !important;
  min-height: 20px !important;
}

#footer_text {
  margin-right: 1em;
  line-height: 16px;

  p + p {
    margin-top: 0.4em;
  }
}

.footer_notice {
  a {
    font-weight: 600;
  }
}

.footer_pride {
  .footer_flags {
    display: flex;

    div {
      height: 1rem;
      width: 1.5rem;

      & + div {
        margin-left: 0.25em;
      }
    }
  }

  a {
    font-size: 0.8rem;
    margin-top: 0.5em;
    color: #fff;

    &:hover {
      text-decoration: underline;
    }
  }
}

#lgbt_modal {
  color: #000;

  p {
    margin-bottom: 1em;
  }
}

.modal_flags {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2em;

  div {
    height: 2rem;
    width: 3rem;

    & + div {
      margin-left: 0.5em;
    }
  }
}

.lgbt_flag {
  background: linear-gradient(
    180deg,
    #fe0000 16.66%,
    #fd8c00 16.66%,
    33.32%,
    #ffe500 33.32%,
    49.98%,
    #119f0b 49.98%,
    66.64%,
    #0644b3 66.64%,
    83.3%,
    #c22edc 83.3%
  );
}

.bi_flag {
  background: linear-gradient(
    180deg,
    #d60270 40%,
    #9b4f96 40%,
    60%,
    #0038a8 60%
  );
}

.trans_flag {
  background: linear-gradient(
    180deg,
    #5bcefa 20%,
    #f5a9b8 20%,
    40%,
    #ffffff 40%,
    60%,
    #f5a9b8 60%,
    80%,
    #5bcefa 80%
  );
}

@media screen and (max-width: 575px) {
  body .page-footer .footer-copyright .wrapper {
    flex-direction: column;
    align-items: center;
  }
}
</style>
