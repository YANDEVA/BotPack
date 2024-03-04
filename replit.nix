{ pkgs }: {
  deps = [
    pkgs.nodejs
    pkgs.libuuid
  ];
  env = {
    LD_LIBRARY_PATH = pkgs.lib.makeLibraryPath [pkgs.libuuid];
  };
}