import {
  useCallback,
  useState,
} from "react";

import {
  createDeployment,
  previewDeployment,
  applyDeployment,
  getDeploymentStatus,
  getDeploymentLogs,
  rollbackDeployment,
  discoverRouter,
} from "../api/networkDeploymentApi";

import type {
  DeploymentCreatePayload,
  DeploymentPreview,
  DeploymentStatus,
} from "../types/networkDeployment";

import type {
  ApplyDeploymentResponse,
} from "../api/networkDeploymentApi";


/* ================================================== */
/* Deployment State                                   */
/* ================================================== */

interface DeploymentState {
  id: string | null;
  status: DeploymentStatus | null;
  preview: DeploymentPreview | null;
  error: string | null;
}


/* ================================================== */
/* Hook                                               */
/* ================================================== */

export function useNetworkDeployment() {

  const [deployment, setDeployment] =
    useState<DeploymentState>({
      id: null,
      status: null,
      preview: null,
      error: null,
    });


  const [loading, setLoading] =
    useState(false);


  const [discovering, setDiscovering] =
    useState(false);


  const [previewing, setPreviewing] =
    useState(false);


  const [applying, setApplying] =
    useState(false);


  const [rollingBack, setRollingBack] =
    useState(false);


  /* ================================================== */
  /* Error Helper                                       */
  /* ================================================== */

  const getErrorMessage = (
    error: unknown,
  ): string => {

    if (error instanceof Error) {
      return error.message;
    }

    if (typeof error === "string") {
      return error;
    }

    return "An unexpected error occurred.";
  };


  /* ================================================== */
  /* Create                                             */
  /* ================================================== */

  const create = useCallback(
    async (
      payload: DeploymentCreatePayload,
    ) => {

      setLoading(true);

      setDeployment(
        previous => ({
          ...previous,
          error: null,
        }),
      );

      try {

        const response =
          await createDeployment<{
            status: string;
            deployment_id: string;
          }>(
            payload,
          );


        if (!response?.deployment_id) {

          throw new Error(
            "The server did not return a deployment ID.",
          );
        }


        setDeployment({
          id: response.deployment_id,
          status: "draft",
          preview: null,
          error: null,
        });


        return response;

      } catch (error) {

        const message =
          getErrorMessage(error);


        setDeployment(
          previous => ({
            ...previous,
            error: message,
          }),
        );


        throw error;

      } finally {

        setLoading(false);
      }
    },
    [],
  );


  /* ================================================== */
  /* Discovery                                          */
  /* ================================================== */

  const discover = useCallback(
    async (
      payload: {
        mikrotik_id: string;
      },
    ) => {

      setDiscovering(true);

      setDeployment(
        previous => ({
          ...previous,
          error: null,
        }),
      );

      try {

        return await discoverRouter(
          payload,
        );

      } catch (error) {

        const message =
          getErrorMessage(error);


        setDeployment(
          previous => ({
            ...previous,
            error: message,
          }),
        );


        throw error;

      } finally {

        setDiscovering(false);
      }
    },
    [],
  );


  /* ================================================== */
  /* Preview                                            */
  /* ================================================== */

  const preview = useCallback(
    async (
      deploymentId?: string,
    ) => {

      const id =
        deploymentId ||
        deployment.id;


      if (!id) {

        throw new Error(
          "Deployment ID is required.",
        );
      }


      setPreviewing(true);

      setDeployment(
        previous => ({
          ...previous,
          error: null,
        }),
      );


      try {

        const response =
          await previewDeployment(id);


        if (
          response.status !==
          "success"
        ) {

          throw new Error(
            response.message ||
            "Unable to generate deployment preview.",
          );
        }


        if (!response.preview) {

          throw new Error(
            "The server returned an empty deployment preview.",
          );
        }


        setDeployment(
          previous => ({
            ...previous,

            id,

            status: "preview",

            preview:
              response.preview!,

            error: null,
          }),
        );


        return response;

      } catch (error) {

        const message =
          getErrorMessage(error);


        setDeployment(
          previous => ({
            ...previous,
            error: message,
          }),
        );


        throw error;

      } finally {

        setPreviewing(false);
      }
    },
    [deployment.id],
  );


  /* ================================================== */
  /* Apply                                              */
  /* ================================================== */

  const apply = useCallback(
    async (
      deploymentId?: string,
    ): Promise<ApplyDeploymentResponse> => {

      const id =
        deploymentId ||
        deployment.id;


      if (!id) {

        throw new Error(
          "Deployment ID is required.",
        );
      }


      /*
       * Do not allow Apply unless the frontend
       * already has a preview.
       *
       * The backend remains the final authority.
       */

      if (
        deployment.status !==
          "preview" &&
        !deploymentId
      ) {

        throw new Error(
          "Deployment must be previewed before it can be applied.",
        );
      }


      setApplying(true);

      setDeployment(
        previous => ({
          ...previous,
          error: null,
        }),
      );


      try {

        const response =
          await applyDeployment(id);


        if (
          response.status !==
          "success"
        ) {

          throw new Error(
            response.message ||
            "Unable to apply deployment.",
          );
        }


        /*
         * Applying the deployment moves the
         * deployment into the running lifecycle.
         */

        setDeployment(
          previous => ({
            ...previous,

            id,

            status: "running",

            error: null,
          }),
        );


        return response;

      } catch (error) {

        const message =
          getErrorMessage(error);


        setDeployment(
          previous => ({
            ...previous,
            error: message,
          }),
        );


        throw error;

      } finally {

        setApplying(false);
      }
    },
    [
      deployment.id,
      deployment.status,
    ],
  );


  /* ================================================== */
  /* Status                                             */
  /* ================================================== */

  const getStatus = useCallback(
    async (
      deploymentId?: string,
    ) => {

      const id =
        deploymentId ||
        deployment.id;


      if (!id) {

        throw new Error(
          "Deployment ID is required.",
        );
      }


      try {

        const response =
          await getDeploymentStatus<{
            status?: DeploymentStatus;

            deployment?: {
              status?: DeploymentStatus;
            };
          }>(
            id,
          );


        const currentStatus =
          response?.status ||
          response?.deployment?.status;


        if (currentStatus) {

          setDeployment(
            previous => ({
              ...previous,

              id,

              status:
                currentStatus,
            }),
          );
        }


        return response;

      } catch (error) {

        const message =
          getErrorMessage(error);


        setDeployment(
          previous => ({
            ...previous,
            error: message,
          }),
        );


        throw error;
      }
    },
    [deployment.id],
  );


  /* ================================================== */
  /* Logs                                               */
  /* ================================================== */

  const getLogs = useCallback(
    async (
      deploymentId?: string,
    ) => {

      const id =
        deploymentId ||
        deployment.id;


      if (!id) {

        throw new Error(
          "Deployment ID is required.",
        );
      }


      return getDeploymentLogs(id);
    },
    [deployment.id],
  );


  /* ================================================== */
  /* Rollback                                           */
  /* ================================================== */

  const rollback = useCallback(
    async (
      deploymentId?: string,
    ) => {

      const id =
        deploymentId ||
        deployment.id;


      if (!id) {

        throw new Error(
          "Deployment ID is required.",
        );
      }


      setRollingBack(true);

      setDeployment(
        previous => ({
          ...previous,
          error: null,
        }),
      );


      try {

        const response =
          await rollbackDeployment(id);


        return response;

      } catch (error) {

        const message =
          getErrorMessage(error);


        setDeployment(
          previous => ({
            ...previous,
            error: message,
          }),
        );


        throw error;

      } finally {

        setRollingBack(false);
      }
    },
    [deployment.id],
  );


  /* ================================================== */
  /* Reset                                              */
  /* ================================================== */

  const reset = useCallback(() => {

    setDeployment({
      id: null,
      status: null,
      preview: null,
      error: null,
    });

  }, []);


  /* ================================================== */
  /* Return                                             */
  /* ================================================== */

  return {
    deployment,

    loading,
    discovering,
    previewing,
    applying,
    rollingBack,

    create,
    discover,
    preview,
    apply,
    getStatus,
    getLogs,
    rollback,
    reset,
  };
}