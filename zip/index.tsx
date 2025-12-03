import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.esm.browser.js';

new Vue({
  el: '#app',
  template: `
    <div id="app-container">
      
      <!-- Trigger Button -->
      <button class="open-btn" @click="openModal" v-if="!isVisible && !isAnimating">
        <span style="margin-right:8px">✏️</span> Write a Note
      </button>

      <!-- The Modal -->
      <!-- We use v-show but manage a wrapper to handle the backdrop properly -->
      <div class="paper-modal-wrapper" v-if="isVisible || isAnimating">
        <div 
          ref="modal"
          class="paper-modal" 
          :class="{ crumpling: isAnimating }"
          :style="modalStyle"
        >
          <button class="close-btn" @click="triggerClose">×</button>
          <h2>Secret Idea</h2>
          <div class="paper-content">
            This is a very important note. <br/>
            If I discard it, it should be crumpled up and thrown into the trash bin!
          </div>
          <button class="action-btn" @click="triggerClose">
            Discard & Throw Away
          </button>
        </div>
      </div>

      <!-- The Trash Bin (Target) -->
      <div ref="trash" class="trash-bin" :class="{ active: isAnimating }">
        🗑️
      </div>

    </div>
  `,
  data() {
    return {
      isVisible: false,
      isAnimating: false,
      modalStyle: {
        '--tx': '0px',
        '--ty': '0px'
      }
    };
  },
  methods: {
    openModal() {
      this.isVisible = true;
      this.isAnimating = false;
      // Reset styles
      this.modalStyle = { '--tx': '0px', '--ty': '0px' };
    },
    triggerClose() {
      if (this.isAnimating) return;

      // 1. Get Coordinates
      const modalEl = this.$refs.modal;
      const trashEl = this.$refs.trash;

      if (modalEl && trashEl) {
        const modalRect = modalEl.getBoundingClientRect();
        const trashRect = trashEl.getBoundingClientRect();

        // Calculate centers
        const modalCenterX = modalRect.left + modalRect.width / 2;
        const modalCenterY = modalRect.top + modalRect.height / 2;

        const trashCenterX = trashRect.left + trashRect.width / 2;
        const trashCenterY = trashRect.top + trashRect.height / 2;

        // Calculate delta
        // We want the element to move TO the trash. 
        // Translate is relative to current position.
        const deltaX = trashCenterX - modalCenterX;
        const deltaY = trashCenterY - modalCenterY;

        // 2. Set CSS Variables for the animation to use
        this.modalStyle = {
          '--tx': `${deltaX}px`,
          '--ty': `${deltaY}px`
        };

        // 3. Start Animation
        this.isAnimating = true;

        // 4. Wait for animation to finish then clean up
        setTimeout(() => {
          this.isVisible = false;
          this.isAnimating = false;
        }, 800); // Matches the 0.8s CSS animation duration
      } else {
        // Fallback if elements not found
        this.isVisible = false;
      }
    }
  }
});
