import {
  CreditCard,
  MapPin,
  Phone,
  Mail,
  House,
  Map,
  Building2,
  Inbox,
  School,
} from "lucide-react";
import { Modal } from "@components/ui/modal";
import { useLocalization } from "@hooks/useLocalization";

interface LicenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLicence: any;
  getLocation: (selectedLicence: any) => string;
  formatDate: (date: string | null) => string;
}

const LicenceModal = ({
  isOpen,
  onClose,
  selectedLicence,
  getLocation,
  formatDate,
}: LicenceModalProps) => {
  const { t } = useLocalization();
  if (!selectedLicence) return null;
  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose} className="max-w-6xl m-4">
        <div className="relative w-full p-6 bg-white rounded-3xl dark:bg-gray-800 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              {t("licence_modal.licence")} {selectedLicence.unique_number}
            </h2>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              {t("licence_modal.main_info")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("licence_modal.bank")}
                </label>
                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <CreditCard className="w-6 h-6 text-gray-400" />
                  {selectedLicence.bank_account || (
                    <span className="text-gray-500 italic dark:text-gray-400">
                      {t("licence_modal.not")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {(selectedLicence.name ||
            selectedLicence.surname ||
            selectedLicence.patronymics) && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
                {t("licence_modal.personal_info")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("licence_modal.name")}
                  </label>
                  <div className="text-gray-900 dark:text-white">
                    {selectedLicence.name || (
                      <span className="text-gray-500 italic dark:text-gray-400">
                        {t("licence_modal.not")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("licence_modal.surname")}
                  </label>
                  <div className="text-gray-900 dark:text-white">
                    {selectedLicence.surname || (
                      <span className="text-gray-500 italic dark:text-gray-400">
                        {t("licence_modal.not")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("licence_modal.fathername")}
                  </label>
                  <div className="text-gray-900 dark:text-white">
                    {selectedLicence.patronymics || (
                      <span className="text-gray-500 italic dark:text-gray-400">
                        {t("licence_modal.not")}
                      </span>
                    )}
                  </div>
                </div>

                {selectedLicence.passport_series && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("licence_modal.passport_series")}
                    </label>
                    <div className="text-gray-900 dark:text-white">
                      {selectedLicence.passport_series}
                    </div>
                  </div>
                )}

                {selectedLicence.passport_number && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("licence_modal.passport_number")}
                    </label>
                    <div className="text-gray-900 dark:text-white">
                      {selectedLicence.passport_number}
                    </div>
                  </div>
                )}

                {selectedLicence.issued_date && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("licence_modal.passport_given_data")}
                    </label>
                    <div className="text-gray-900 dark:text-white">
                      {formatDate(selectedLicence.issued_date)}
                    </div>
                  </div>
                )}

                {selectedLicence.registered_by && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("licence_modal.who_gives")}
                    </label>
                    <div className="text-gray-900 dark:text-white">
                      {selectedLicence.registered_by}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
              {t("licence_modal.contact_info")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("licence_modal.location")}
                </label>
                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <MapPin className="w-6 h-6 text-gray-400" />
                  {getLocation(selectedLicence)}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("licence_modal.city")}
                </label>
                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Building2 className="w-6 h-6 text-gray-400" />
                  {selectedLicence.city || (
                    <span className="text-gray-500 italic dark:text-gray-400">
                      {t("licence_modal.not")}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("licence_modal.street")}
                </label>
                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Map className="w-6 h-6 text-gray-400" />
                  {selectedLicence.street || (
                    <span className="text-gray-500 italic dark:text-gray-400">
                      {t("licence_modal.not")}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("licence_modal.building")}
                </label>
                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <School className="w-6 h-6 text-gray-400" />
                  {selectedLicence.building || (
                    <span className="text-gray-500 italic dark:text-gray-400">
                      {t("licence_modal.not")}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("licence_modal.house")}
                </label>
                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <House className="w-6 h-6 text-gray-400" />
                  {selectedLicence.apartment || (
                    <span className="text-gray-500 italic dark:text-gray-400">
                      {t("licence_modal.not")}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("licence_modal.mail_index")}
                </label>
                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Inbox className="w-6 h-6 text-gray-400" />
                  {selectedLicence.postal_index || (
                    <span className="text-gray-500 italic dark:text-gray-400">
                      {t("licence_modal.not")}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("licence_modal.phone")}
                </label>
                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Phone className="w-6 h-6 text-gray-400" />
                  {selectedLicence.phone || (
                    <span className="text-gray-500 italic dark:text-gray-400">
                      {t("licence_modal.not")}
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div className="flex items-center gap-2 text-gray-900 dark:text-white">
                  <Mail className="w-6 h-6 text-gray-400" />
                  {selectedLicence.email || (
                    <span className="text-gray-500 italic dark:text-gray-400">
                      {t("licence_modal.not")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default LicenceModal;
