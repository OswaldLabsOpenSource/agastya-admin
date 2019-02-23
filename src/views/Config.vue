<template>
  <v-layout class="margin">
    <v-snackbar v-model="hasMessage" :timeout="5000" bottom right>
      {{ message }}
      <v-btn
        flat
        @click="
          hasMessage = false;
          message = '';
        "
        >Close</v-btn
      >
    </v-snackbar>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-tabs fixed-tabs color="grey lighten-3" v-model="activeTab">
          <v-tab :key="0">Configuration</v-tab>
          <v-tab :key="2">JSON</v-tab>
          <v-tab-item :key="0">
            <v-layout align-center justify-center>
              <v-card-title primary-title>
                <div>
                  <h3 class="headline">
                    Editing {{ key.title || key.apiKey }}
                  </h3>
                </div>
              </v-card-title>
            </v-layout>
            <v-card flat>
              <v-form class="form" @submit.prevent="save">
                <v-text-field
                  @input="forceUpdate"
                  v-model="key.apiKey"
                  type="text"
                  label="API key"
                  messages="Your Agastya API key; you cannot change this"
                  disabled
                />
                <v-text-field
                  @input="forceUpdate"
                  v-model="key.title"
                  type="text"
                  label="Name"
                  messages="A name to help you remember this API key (e.g., your website's name)"
                />
                <v-combobox
                  v-model="key.domains"
                  label="Domains"
                  messages="List of domains to allow running Agastya on, press tab to add new one"
                  :items="[]"
                  multiple
                  chips
                >
                  <template slot="selection" slot-scope="data">
                    <v-chip
                      :key="JSON.stringify(data.item)"
                      :selected="data.selected"
                      :disabled="data.disabled"
                      class="v-chip--select-multi"
                      @input="data.parent.selectItem(data.item)"
                    >
                      <v-avatar>
                        <img
                          :src="
                            `https://www.google.com/s2/favicons?sz=32&domain=${
                              data.item
                            }`
                          "
                        />
                      </v-avatar>
                      {{ data.item }}
                    </v-chip>
                  </template>
                </v-combobox>
                <v-btn
                  type="submit"
                  class="small-submit"
                  color="info"
                  :loading="loading"
                >
                  Save settings
                </v-btn>
                <h2>Branding</h2>
                <v-layout row>
                  <v-flex>
                    <v-text-field
                      @input="forceUpdate"
                      v-model="key.backgroundColor"
                      type="text"
                      label="Brand color"
                      messages="Background color for the plugin icon and headers"
                    />
                    <div class="colors">
                      <button
                        type="button"
                        v-for="color in [
                          { name: 'blue', hex: '#007bff' },
                          { name: 'green', hex: '#1abc9c' },
                          { name: 'yellow', hex: '#f1c40f' },
                          { name: 'orange', hex: '#e67e22' },
                          { name: 'red', hex: '#e74c3c' },
                          { name: 'purple', hex: '#9b59b6' },
                          { name: 'gray', hex: '#34495e' }
                        ]"
                        @click.prevent="
                          key.backgroundColor = color.hex;
                          forceUpdate();
                        "
                        :aria-label="color.name"
                        :style="`background-color: ${color.hex}`"
                        :key="color.hex"
                      >
                        <v-icon
                          class="inner-icon"
                          v-if="color.hex === key.backgroundColor"
                          color="white"
                          >done</v-icon
                        >
                      </button>
                    </div>
                    <v-text-field
                      @input="forceUpdate"
                      v-model="key.foregroundColor"
                      type="text"
                      label="Text color"
                      messages="Text color for the plugin icon and headers"
                    />
                    <v-text-field
                      @input="forceUpdate"
                      v-model="key.layout.heading"
                      type="text"
                      label="Heading"
                      messages="This will be the title when a user opens the Agastya widget"
                    />
                    <v-text-field
                      @input="forceUpdate"
                      v-model="key.layout.subheading"
                      type="text"
                      label="Subheading"
                      messages="Add a subheading, e.g., your website name"
                    />
                  </v-flex>
                  <v-flex md6>
                    <div class="color-preview">
                      <div
                        class="heading-preview"
                        :style="
                          `background-color: ${key.backgroundColor}; color: ${
                            key.foregroundColor
                          }`
                        "
                      >
                        <div class="heading-1">Example Heading</div>
                        <div class="heading-2">Website name</div>
                      </div>
                      <div
                        class="circle-preview"
                        :style="
                          `background-color: ${key.backgroundColor}; color: ${
                            key.foregroundColor
                          }`
                        "
                      >
                        <v-icon :color="key.foregroundColor" size="40"
                          >accessibility</v-icon
                        >
                      </div>
                      <div
                        class="circle-preview"
                        :style="
                          `background-color: ${key.backgroundColor}; color: ${
                            key.foregroundColor
                          }`
                        "
                      >
                        <v-icon :color="key.foregroundColor" size="40"
                          >help</v-icon
                        >
                      </div>
                      <div
                        class="circle-preview"
                        :style="
                          `background-color: ${key.backgroundColor}; color: ${
                            key.foregroundColor
                          }`
                        "
                      >
                        <v-icon :color="key.foregroundColor" size="40"
                          >build</v-icon
                        >
                      </div>
                    </div>
                  </v-flex>
                </v-layout>
                <v-btn
                  type="submit"
                  class="small-submit"
                  color="info"
                  :loading="loading"
                >
                  Save branding
                </v-btn>
                <h2>Integrations</h2>
                <v-container class="unpadded integrations" grid-list-xl>
                  <v-layout row wrap>
                    <v-flex
                      v-for="(service, slug) in integrations"
                      :key="`service_${slug}`"
                      xs6
                    >
                      <v-card>
                        <v-card-title>
                          <div class="emoji-icon">{{ service.emoji }}</div>
                          <h3>{{ service.title }}</h3>
                          <p>{{ service.description }}</p>
                          <div
                            v-if="service.enabled && service.visible"
                            class="additional-settings"
                          >
                            <h4>Configure</h4>
                            <v-text-field
                              v-for="(control, index) in service.enabled"
                              :key="`input_${slug}_${index}`"
                              @input="forceUpdate"
                              type="text"
                              :label="control.label"
                              v-model="integrations[slug].enabled[index].value"
                              :messages="control.message"
                              :required="control.required"
                            />
                          </div>
                        </v-card-title>
                        <v-card-actions>
                          <v-btn
                            type="button"
                            @click.prevent="
                              service.enabled ? show(slug) : enable(slug)
                            "
                            v-if="!key.integrations[slug]"
                            flat
                            color="blue"
                            >Enable</v-btn
                          >
                          <v-btn
                            type="button"
                            @click.prevent="disable(slug)"
                            v-else
                            flat
                            color="blue-grey"
                            >Disable</v-btn
                          >
                        </v-card-actions>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-container>
                <v-btn
                  type="submit"
                  class="small-submit"
                  color="info"
                  :loading="loading"
                >
                  Save integrations
                </v-btn>
                <h2>Advanced</h2>
                <v-layout row>
                  <v-flex md6>
                    <h3>Custom CSS</h3>
                  </v-flex>
                  <v-flex md6 style="text-align: right">
                    <v-dialog v-model="addCss" persistent max-width="600px">
                      <v-btn
                        slot="activator"
                        style="margin-bottom: 1rem; margin-top: -1rem"
                        >Add another rule</v-btn
                      >
                      <v-card>
                        <v-card-text>
                          <v-form @submit.prevent="addNewCss">
                            <v-select
                              :items="modes"
                              v-model="newCss.mode"
                              label="Mode"
                            />
                            <v-textarea
                              v-model="newCss.css"
                              label="Custom CSS"
                            />
                          </v-form>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn flat @click="addCss = false">Delete</v-btn>
                            <v-btn color="blue" flat @click="addNewCss"
                              >Save</v-btn
                            >
                          </v-card-actions>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                  </v-flex>
                </v-layout>
                <v-data-table
                  :headers="[
                    { text: 'Accessibility mode', value: 'mode' },
                    { text: 'CSS', value: 'css' },
                    { text: 'Edit', value: 'edit' },
                    { text: 'Delete', value: 'delete' }
                  ]"
                  :items="key.customCss"
                  class="elevation-1"
                >
                  <template slot="items" slot-scope="props">
                    <td>{{ props.item.mode }}</td>
                    <td>{{ props.item.css }}</td>
                    <td>
                      <v-icon small @click="editCss(props.item)">
                        edit
                      </v-icon>
                    </td>
                    <td>
                      <v-icon small @click="deleteCss(props.item)">
                        delete
                      </v-icon>
                    </td>
                  </template>
                </v-data-table>
                <v-text-field
                  @input="forceUpdate"
                  v-model="key.variables.readAloudSelector"
                  type="text"
                  label="Read aloud selector"
                  messages="A CSS selector for the main content of your page for read aloud (e.g., main#content)"
                />
                <v-text-field
                  @input="forceUpdate"
                  v-model="key.links.privacyPolicy"
                  type="text"
                  label="Privacy Policy link"
                  messages="Link to your privacy policy for EU cookie law compliance"
                />
                <v-text-field
                  @input="forceUpdate"
                  v-model="key.links.cookiePolicy"
                  type="text"
                  label="Cookie Policy link"
                  messages="Link to your cookie policy for EU cookie law compliance"
                />
                <v-btn
                  type="submit"
                  class="small-submit"
                  color="info"
                  :loading="loading"
                >
                  Save advanced
                </v-btn>
                <h2>Danger Zone</h2>
                <p>
                  <strong>Warning:</strong> Deleting an API key is not
                  reversable. Agastya will immediately stop working on your
                  website and all your configuration will be deleted. Enter this
                  API key to confirm.
                </p>
                <v-text-field
                  v-model="deleteApiKey"
                  type="text"
                  label="API key"
                  messages="Enter this API key to delete"
                />
                <v-btn
                  type="button"
                  class="small-submit"
                  color="red darken-3"
                  @click.prevent="deleteKey"
                  dark
                  :disabled="deleteApiKey !== $route.params.apiKey"
                  :loading="loading"
                >
                  Delete this API key
                </v-btn>
              </v-form>
            </v-card>
          </v-tab-item>
          <v-tab-item :key="2">
            <v-card class="json-text" flat>
              <pre
                v-highlightjs="JSON.stringify(key, null, 2)"
              ><code class="json"></code></pre>
            </v-card>
          </v-tab-item>
        </v-tabs>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import integrations from "../integrations";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      key: {
        layout: {},
        integrations: {},
        customCss: [],
        variables: {},
        links: {}
      },
      integrations,
      deleteApiKey: "",
      json: "{}",
      activeTab: 0,
      loading: false,
      hasMessage: false,
      message: "",
      color: "#1ca085",
      addCss: false,
      newCss: {
        mode: "",
        css: ""
      },
      modes: ["dyslexia", "night", "blue-light-filter"]
    };
  },
  computed: {
    ...mapGetters(["keys"])
  },
  mounted() {
    this.updateKeys();
  },
  watch: {
    keys() {
      this.updateKeys();
    },
    key() {
      this.json = JSON.stringify(this.key, null, 2);
    },
    message() {
      this.hasMessage = !!this.message;
    }
  },
  methods: {
    deleteKey() {
      this.loading = true;
      this.$http
        .delete(`/agastya/api-keys/${this.$route.params.apiKey}`)
        .then(() => {
          this.$router.push("/my-apis/?relax=true");
        })
        .catch(() => {})
        .then(() => (this.loading = false));
    },
    deleteCss(toDelete) {
      this.key.customCss.forEach((item, index) => {
        if (item.css === toDelete.css && item.mode === toDelete.mode)
          return this.key.customCss.splice(index, 1);
      });
    },
    editCss(toEdit) {
      this.deleteCss(toEdit);
      this.newCss.mode = toEdit.mode;
      this.newCss.css = toEdit.css;
      this.addCss = true;
    },
    addNewCss() {
      this.key.customCss.push({
        mode: this.newCss.mode,
        css: this.newCss.css
      });
      this.newCss.mode = "";
      this.newCss.css = "";
      this.addCss = false;
    },
    show(slug) {
      if (!this.integrations[slug].visible) {
        this.integrations[slug].visible = true;
      } else {
        this.integrations[slug].visible = false;
        this.enable(slug);
      }
      this.forceUpdate();
    },
    enable(slug) {
      let updateObject = {};
      if (
        this.integrations[slug] &&
        this.integrations[slug].enabled &&
        typeof this.integrations[slug].enabled === "object"
      ) {
        for (let i = 0; i < this.integrations[slug].enabled.length; i++) {
          updateObject[
            this.integrations[slug].enabled[i].model
          ] = this.integrations[slug].enabled[i].value;
        }
      }
      this.key.integrations[slug] = Object.keys(updateObject).length
        ? updateObject
        : true;
      this.forceUpdate();
    },
    disable(slug) {
      delete this.key.integrations[slug];
      this.forceUpdate();
    },
    forceUpdate() {
      this.$forceUpdate();
    },
    updateKeys() {
      this.key =
        this.keys.filter(key => key.apiKey === this.$route.params.apiKey)[0] ||
        {};
      delete this.key.owner;
      this.key.backgroundColor = this.key.backgroundColor || "#007bff";
      this.key.foregroundColor = this.key.foregroundColor || "#ffffff";
      this.key.customCss = this.key.customCss || [];
      this.key.variables = this.key.variables || {};
      this.key.links = this.key.links || {};
      this.key.layout = this.key.layout || {};
      this.key.integrations = this.key.integrations || {};
      this.key.layout.heading =
        this.key.layout.heading || "Help & Accessibility";
      this.key.layout.subheading = this.key.layout.subheading || this.key.title;
    },
    update() {
      this.loading = true;
      this.$http
        .get(`/agastya/api-keys/${this.$route.params.apiKey}`)
        .then(response => {
          this.$store.commit(
            "updateKey",
            this.$route.params.apiKey,
            response.data
          );
        })
        .catch(() => {})
        .then(() => (this.loading = false));
    },
    save() {
      this.loading = true;
      this.$http
        .patch(`/agastya/api-keys/${this.$route.params.apiKey}`, this.key)
        .then(() => {
          this.message = "Your API has been updated!";
        })
        .catch(error => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.error
          ) {
            this.message = error.response.data.error;
          }
        })
        .then(() => {
          this.loading = false;
          this.update();
        });
    }
  }
};
</script>

<style>
.form {
  padding: 4rem;
  padding-top: 2rem;
}
.margin {
  margin: 4rem 0;
}
.domains-list {
  margin-top: 1.5rem;
}
.json-text code {
  padding: 2rem;
  width: 100%;
}
.json-text code::before,
.json-text code::after {
  display: none;
}
.hljs {
  font-size: 100%;
  color: #c0392b;
}
.hljs-attr {
  color: #2980b9;
}
.hljs-string {
  color: #16a085;
}
* + h2 {
  margin-top: 2rem;
}
h2 {
  font-weight: normal;
  margin-bottom: 1rem;
}
.color-preview {
  padding-left: 2rem;
}
.heading-preview {
  background-color: #aaa;
  padding: 1.5rem;
  border-radius: 0.2rem;
}
.heading-1 {
  font-size: 150%;
}
.heading-2 {
  font-size: 125%;
  opacity: 0.75;
}
.headline {
  margin-top: 2rem;
}
.v-input + .v-input,
.elevation-1 + .v-input {
  margin-top: 1.5rem;
}
.circle-preview {
  background-color: gray;
  display: inline-block;
  width: 4rem;
  height: 4rem;
  text-align: center;
  line-height: 5.72rem;
  border-radius: 4rem;
  margin-top: 2rem;
  margin-right: 2rem;
}
.colors {
  margin-top: 1rem;
  margin-bottom: 1rem;
}
.colors button {
  background-color: gray;
  width: 2rem;
  height: 2rem;
  border-radius: 2rem;
  margin-right: 1rem;
  position: relative;
}
.colors .inner-icon {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.save-button {
  margin-top: 2.5rem;
  font-size: 125%;
}
.small-submit {
  margin-top: 2rem;
  margin-left: 0;
  margin-bottom: 2rem;
}
.unpadded {
  padding: 0 !important;
}
.integrations .v-card__title {
  padding: 1.9rem;
  padding-bottom: 0;
}
.integrations p {
  margin-bottom: 0.5rem;
}
.emoji-icon {
  margin-right: 1rem;
  font-size: 200%;
  vertical-align: middle;
}
</style>